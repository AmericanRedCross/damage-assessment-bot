import { HttpRequest, HttpResponse, Context } from "azure-functions-ts-essentials";

export default class HttpAzureFunctionContextMock implements Context {
    constructor() {
    }

    invocationId?: string;
    executionContext?: any;
    bindings?: any;
    req?: HttpRequest;
    bindingData?: any;
    res?: HttpResponse;
    log?: {
        (...message: Array<any>): void;
        error(...message: Array<any>): void;
        warn(...message: Array<any>): void;
        info(...message: Array<any>): void;
        verbose(...message: Array<any>): void;
        metric(...message: Array<any>): void;
    };
    bind?(...args: Array<any>): void;
    done(err?: Error | undefined, propertyBag?: {
        [key: string]: any;
    }): void {}
}