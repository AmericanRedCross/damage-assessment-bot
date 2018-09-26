import { Context, HttpStatusCode } from "azure-functions-ts-essentials";
import { RcdaHttpFunction, RcdaHttpRequest, RcdaHttpResponse, RcdaHttpResponseError } from "@/functions/utils/rcda-http-types";
import RcdaHttpHeaders from "@/functions/utils/RcdaHttpHeaders";
import UserSession from "@common/models/resources/UserSession";
import RcdaError, { RcdaErrorTypes } from "@common/system/RcdaError";
import RcdaAuthorizationPolicy from "@common/system/RcdaAuthorizationPolicy";
import { RcdaHttpResponseHeaders, RcdaAzureHttpFunction } from "@/functions/utils/rcda-http-types";
import SessionUtility from "@/services/utils/SessionUtility";
import { RcdaRoles } from "@common/system/RcdaRoles";

export default function rcdaHttpFunction<TBody, TResult, TDependencies>(    
    dependencyFactory: () => TDependencies,
    auth: boolean|RcdaRoles[]|RcdaAuthorizationPolicy,
    implementation: RcdaHttpFunction<TBody, TResult, TDependencies>): RcdaAzureHttpFunction<TBody,TResult,TDependencies>
{
    let authPolicy: RcdaAuthorizationPolicy;
    if (typeof auth === "boolean") {
        authPolicy = auth ? new RcdaAuthorizationPolicy() : null;
    }
    else if (typeof auth === "object") {
        if (auth.hasOwnProperty("length")) {
            authPolicy = new RcdaAuthorizationPolicy(<RcdaRoles[]>auth);
        }
        else {
            authPolicy = <RcdaAuthorizationPolicy>auth;
        }
    }

    let result: any = async function(context: Context, req: RcdaHttpRequest<TBody>): Promise<RcdaHttpResponse<TResult>> 
    {
        let session: UserSession = null;
        // Authenticate, if required
        if (authPolicy) {
            let sessionUtil = SessionUtility.getInstance();
            
            let authHeader = req.headers && req.headers.authorization ? req.headers.authorization : "";
            let sessionToken = authHeader.toLowerCase().startsWith("bearer ") ? authHeader.slice("bearer ".length) : "";
                
            session = sessionUtil.parseSessionToken(sessionToken);
            if (!sessionUtil.isValidSession(session)) {
                return httpResponse(HttpStatusCode.Unauthorized);
            }
            if (!sessionUtil.isAuthorized(session, authPolicy)) {
                return httpResponse(HttpStatusCode.Forbidden);
            }
        }
        try {
            // Execute the request
            let response = await implementation(req, dependencyFactory(), { context, session });
            response.headers = response.headers || {};
            if (response.body && !response.headers[RcdaHttpHeaders.ContentType]) {
                response.headers[RcdaHttpHeaders.ContentType] = "application/json";
            }
            return response;
        }
        catch (error) {
            return formatErrorResponse(error);
        }
    }

    result.dependencyFactory = dependencyFactory;
    result.implementation = implementation;
    result.authPolicy = authPolicy;

    return result;
}

function formatErrorResponse(error: Error): RcdaHttpResponse<RcdaHttpResponseError> {
    let rcdaError = <RcdaError<any>>error;
    switch (rcdaError.typeId) {
        case RcdaErrorTypes.ClientError: {
            return httpResponse(HttpStatusCode.BadRequest, formatRcdaError(rcdaError));
        }
        case RcdaErrorTypes.SystemError: 
        case undefined: {
            return httpResponse(HttpStatusCode.InternalServerError);
        }
        default: {
            return httpResponse(HttpStatusCode.NotImplemented);
        }
    }
}

function httpResponse(status: HttpStatusCode, body: RcdaHttpResponseError = null, headers?: RcdaHttpResponseHeaders) {
    return {
        status,
        body,
        headers: headers || !body ? {} : { [RcdaHttpHeaders.ContentType]: "application/json" }
    }
}

function formatRcdaError(error: RcdaError<any>): RcdaHttpResponseError {
    let response: RcdaHttpResponseError = {
        error: {
            code: error.typeId,
            message: error.message,
        }
    };
    if (error.details) {
        response.error.details = error.details;
    }
    return response;
}