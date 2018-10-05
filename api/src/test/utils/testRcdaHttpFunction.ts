import { RcdaAzureHttpFunction, RcdaHttpResponse, RcdaHttpRequest } from "@/functions/utils/rcda-http-types";
import rcdaHttpFunction from "@/functions/utils/rcdaHttpFunction";
import { Context } from "azure-functions-ts-essentials";
import genericMock from "@/test/mocks/genericMock";

export default async function testRcdaHttpFunction<TBody, TResult, TDependencies>(config: {
    definition: RcdaAzureHttpFunction<TBody, TResult, TDependencies>,
    dependencies: TDependencies,
    request: RcdaHttpRequest<TBody>,
    context?: Partial<Context>
}): Promise<RcdaHttpResponse<TResult>> {

    let testFunction = rcdaHttpFunction(() => <TDependencies>config.dependencies, config.definition.authPolicy, config.definition.implementation);
    
    return await testFunction(<any>{ bindings: {}, log: genericMock(), ...config.context }, config.request);
}