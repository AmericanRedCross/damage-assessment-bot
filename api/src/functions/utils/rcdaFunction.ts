import { Context } from "azure-functions-ts-essentials";

export default function rcdaFunction<TBindings, TDependencies>(
    dependencyFactory: () => TDependencies,
    executeFunction: (bindings: TBindings, deps: TDependencies, context: Context) => Promise<any>
) {
    let self: any = function(context: Context, req: any) {
        executeFunction(context.bindings, self.dependencyFactory(), context)
    };
    
    self.dependencyFactory = dependencyFactory;

    return self;
}