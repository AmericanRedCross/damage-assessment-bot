import { HttpMethod } from "azure-functions-ts-essentials";
import { RcdaHttpRequest } from "@/functions/utils/rcda-http-types";
import UserSession from "@common/models/resources/UserSession";
import SessionUtility from "@/services/utils/SessionUtility";

let sessionUtil = SessionUtility.getInstance();

export default class HttpRequestMock<TBody=any> implements RcdaHttpRequest<TBody> {
    constructor({ body = null, userSession = null }: { body?: TBody, userSession?: UserSession } = {}) {
        this.body = body;
        let token = userSession ? sessionUtil.getSessionToken(userSession) : "";
        if (userSession) {
            this.headers["authorization"] = `bearer ${token}`
        }
    }

    originalUrl: string = null;
    method: HttpMethod;
    query: { [key: string]: any };
    headers: { [key: string]: any } = {};
    body: TBody = null;
    params: { [key: string]: any };
    rawBody: any;
}