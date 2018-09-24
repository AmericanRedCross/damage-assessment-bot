import { Context, HttpStatusCode } from "azure-functions-ts-essentials";
import { RcdaHttpFunction, RcdaHttpRequest, RcdaHttpResponse, RcdaHttpResponseError } from "@/function-utils/rcda-http-types";
import RcdaHttpHeaders from "@/function-utils/RcdaHttpHeaders";
import LoginService from "@/services/LoginService";
import UserSession from "@common/models/user/UserSession";
import RcdaRoles from "@common/system/RcdaRoles";
import RcdaError, { RcdaErrorTypes } from "@/common/errors/RcdaError";
import RcdaAuthPolicy from "@common/system/RcdaAuthPolicy";

export default function rcdaHttpFunction<TBody, TResult, TDependencies>(    
    dependenciesConstructor: new () => TDependencies,
    authentication: RcdaAuthPolicy,
    executeFunction: RcdaHttpFunction<TBody, TResult, TDependencies>) 
{
    return async function(
        context: Context, 
        req: RcdaHttpRequest<TBody>, 
        dependencies = new dependenciesConstructor()): Promise<RcdaHttpResponse<TResult>> 
    {
        let session: UserSession = null;
        // Authenticate, if required
        if (authentication) {
            let loginService = LoginService.getInstance();
            if (!req.headers.authorization || ! req.headers.authorization.toLowerCase().startsWith("bearer ")) {
                return {
                    status: HttpStatusCode.Unauthorized,
                    body: null
                }
            }
            let sessionToken = req.headers.authorization.slice("bearer ".length);
            session = await loginService.verify(sessionToken);
            if (!session) {
                return {
                    status: HttpStatusCode.Unauthorized,
                    body: null
                }
            }
            //TODO further verification of user session, roles, etc
            else if (false) {
                return {
                    status: HttpStatusCode.Forbidden,
                    body: null
                }
            }
        }
        try {
            // Execute the request
            let response = await executeFunction(req, dependencies, { context, session });
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
}

function formatErrorResponse(error: Error): RcdaHttpResponse<RcdaHttpResponseError> {
    let response = {
        status: HttpStatusCode.NotImplemented,
        body: <RcdaHttpResponseError>null,
        headers: {
            [RcdaHttpHeaders.ContentType]: "application/json"
        }
    };
    let rcdaError = error as RcdaError;
    switch (rcdaError.typeId) {
        case RcdaErrorTypes.ClientError: {
            response.status = HttpStatusCode.BadRequest;
            response.body = buildError(rcdaError);
            break;
        }
        case undefined:
        case RcdaErrorTypes.SystemError: {
            response.status = HttpStatusCode.InternalServerError;
            break;
        }
    }
    return response;
}

function buildError(error: RcdaError): RcdaHttpResponseError {
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