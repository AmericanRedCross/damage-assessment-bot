import { RcdaAzureHttpFunction, RcdaHttpResponse, RcdaHttpRequest } from "@/functions/utils/rcda-http-types";
import rcdaHttpFunction from "@/functions/utils/rcdaHttpFunction";
import { Context } from "azure-functions-ts-essentials";

export default async function testRcdaHttpFunction<TBody, TResult, TDependencies>(config: {
    definition: RcdaAzureHttpFunction<TBody, TResult, TDependencies>,
    dependencies: TDependencies,
    request: RcdaHttpRequest<TBody>,
    context?: Partial<Context>
}): Promise<RcdaHttpResponse<TResult>> {

    let testFunction = rcdaHttpFunction(() => <TDependencies>config.dependencies, config.definition.authPolicy, config.definition.implementation);
    
    return await testFunction(config.context || <any>{ bindings: {}}, config.request);
}