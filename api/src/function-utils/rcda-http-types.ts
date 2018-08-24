import { Context, HttpRequest, HttpResponse, HttpStatusCode } from "azure-functions-ts-essentials";
import RcdaHttpHeaders from "@/function-utils/RcdaHttpHeaders";
import UserSession from "@common/models/user/UserSession";

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

export type RcdaHttpFunctionContext = { context: Context, session?: UserSession };

export type RcdaHttpFunction<TBody, TResult, TDependencies> = 
    (req: RcdaHttpRequest<TBody>, deps: TDependencies, context: RcdaHttpFunctionContext) => Promise<RcdaHttpResponse<TResult>>;



