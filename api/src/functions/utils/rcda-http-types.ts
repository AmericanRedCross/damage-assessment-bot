import { Context, HttpRequest, HttpResponse, HttpStatusCode } from "azure-functions-ts-essentials";
import RcdaHttpHeaders from "@/functions/utils/RcdaHttpHeaders";
import UserSession from "@common/models/resources/UserSession";
import RcdaAuthorizationPolicy from "@common/system/RcdaAuthorizationPolicy";

export interface RcdaHttpRequest<TBody> extends HttpRequest {
    body: TBody;
}

export type RcdaHttpResponseHeaders = { [key in RcdaHttpHeaders]?: string };

export interface RcdaHttpResponseError {
    error: {
        code: string,
        message: string,
        details?: any
    }
}

export interface RcdaHttpResponse<TResult> extends HttpResponse {
    body: TResult|RcdaHttpResponseError;
    status: HttpStatusCode;
    headers?: RcdaHttpResponseHeaders;
}

export interface RcdaHttpFunctionContext { 
    context: Context, 
    session?: UserSession 
};

export interface RcdaHttpFunction<TBody, TResult, TDependencies> {
    (req: RcdaHttpRequest<TBody>, deps: TDependencies, context: RcdaHttpFunctionContext): Promise<RcdaHttpResponse<TResult>>;
}

export interface RcdaAzureHttpFunction<TBody, TResult, TDependencies> {
    (context: Context, req: RcdaHttpRequest<TBody>): Promise<RcdaHttpResponse<TResult>>;
    dependencyFactory: () => TDependencies;
    implementation: RcdaHttpFunction<TBody, TResult, TDependencies>,
    authPolicy: RcdaAuthorizationPolicy
}


