import { Context, HttpStatusCode } from "azure-functions-ts-essentials";
import { RcdaHttpFunction, RcdaHttpRequest, RcdaHttpResponse, RcdaHttpResponseError } from "@/functions/utils/rcda-http-types";
import RcdaHttpHeaders from "@/functions/utils/RcdaHttpHeaders";
import UserSession from "@common/models/resources/UserSession";
import RcdaError, { RcdaErrorTypes } from "@common/system/RcdaError";
import RcdaAuthorizationPolicy from "@common/system/RcdaAuthorizationPolicy";
import { RcdaHttpResponseHeaders, RcdaAzureHttpFunction } from "@/functions/utils/rcda-http-types";
import SessionUtility from "@/services/utils/SessionUtility";
import { RcdaRoles } from "@common/system/RcdaRoles";

export class RcdaHttpFunctionDependencies {
    constructor(public sessionUtility: SessionUtility) {}

    public static getInstance(): RcdaHttpFunctionDependencies {
        return new RcdaHttpFunctionDependencies(SessionUtility.getInstance())
    }
}

export default function rcdaHttpFunction<TBody, TResult, TDependencies>(    
    dependencyFactory: () => TDependencies|null,
    authDef: boolean|RcdaRoles[]|RcdaAuthorizationPolicy,
    implementation: RcdaHttpFunction<TBody, TResult, TDependencies>,
    rcdaHttpFunctionDependencyFactory: () => RcdaHttpFunctionDependencies = RcdaHttpFunctionDependencies.getInstance): RcdaAzureHttpFunction<TBody,TResult,TDependencies>
{
    let { sessionUtility } = rcdaHttpFunctionDependencyFactory();

    let authPolicy = getAuthPolicy(authDef);

    let run: any = async function(context: Context, req: RcdaHttpRequest<TBody>): Promise<RcdaHttpResponse<TResult>> 
    {
        try {
            // Authorize
            let authHeader = req.headers && req.headers.authorization ? req.headers.authorization : "";
            let sessionToken = authHeader.toLowerCase().startsWith("bearer ") ? authHeader.slice("bearer ".length) : "";
                
            let session = sessionUtility.getValidSession(sessionToken);
            if (authPolicy && !session) {
                return httpResponse(HttpStatusCode.Unauthorized);
            }
            if (!sessionUtility.isAuthorized(session, authPolicy)) {
                return httpResponse(HttpStatusCode.Forbidden);
            }

            // Execute the request
            let dependencies = dependencyFactory ? dependencyFactory() : null;
            let response = await implementation(req, dependencies, { context, session });
            response.headers = response.headers || {};
            if (response.body && !response.headers[RcdaHttpHeaders.ContentType]) {
                response.headers[RcdaHttpHeaders.ContentType] = "application/json";
            }
            return response;
        }
        catch (error) {
            let errorResponse = formatErrorResponse(error);

            if (errorResponse.status === HttpStatusCode.InternalServerError) {
                context.log.error(error.message);
            }

            return errorResponse;
        }
    }

    run.dependencyFactory = dependencyFactory;
    run.implementation = implementation;
    run.authPolicy = authPolicy;

    return run;
}

function getAuthPolicy(authDef: boolean|RcdaRoles[]|RcdaAuthorizationPolicy): RcdaAuthorizationPolicy {
    if (typeof authDef === "boolean") {
        return authDef ? new RcdaAuthorizationPolicy() : null;
    }
    if (typeof authDef === "object") {
        if (!authDef) {
            return null;
        }
        if (authDef.hasOwnProperty("length")) {
            return new RcdaAuthorizationPolicy(<RcdaRoles[]>authDef);
        }
        else {
            return <RcdaAuthorizationPolicy>authDef;
        }
    }

    throw new Error("Invalid auth definition");
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