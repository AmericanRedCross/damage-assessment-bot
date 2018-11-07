import { RcdaAzureHttpFunction, RcdaHttpResponse, RcdaHttpRequest } from "@/functions/utils/rcda-http-types";
import rcdaHttpFunction, { RcdaHttpFunctionDependencies } from "@/functions/utils/rcdaHttpFunction";
import { Context } from "azure-functions-ts-essentials";
import genericMock from "@/test/mocks/genericMock";
import SessionUtility from "@/services/utils/SessionUtility";
import * as jsonwebtoken from "jsonwebtoken";
import DateUtility from "@/services/utils/DateUtility";
import TestSessionUtility from "../utils/TestSessionUtility";

export default async function testRcdaHttpFunction<TBody, TResult, TDependencies>(config: {
    definition: RcdaAzureHttpFunction<TBody, TResult, TDependencies>,
    dependencies: TDependencies,
    request: RcdaHttpRequest<TBody>,
    context?: Partial<Context>
}): Promise<RcdaHttpResponse<TResult>> {

    let mockRcdaHttpFunctionDependencies: RcdaHttpFunctionDependencies = {
        sessionUtility: new TestSessionUtility()
    };

    let testFunction = rcdaHttpFunction(
        () => config.dependencies,
        config.definition.authPolicy,
        config.definition.implementation,
        () => mockRcdaHttpFunctionDependencies);

    let mockAzureFunctionContext: Partial<Context> = {
        bindings: {},
        log: genericMock(),
        ...config.context
    };

    return await testFunction(<any>mockAzureFunctionContext, config.request);
}