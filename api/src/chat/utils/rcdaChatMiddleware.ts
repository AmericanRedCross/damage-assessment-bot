import { RcdaSessionMiddleware, RcdaChatMiddleware } from "@/chat/utils/rcda-chat-types";

export default function rcdaChatMiddleware<TDependencies>(
    dependencyFactory: () => TDependencies,
    rcdaMiddleware: RcdaSessionMiddleware<TDependencies>): RcdaChatMiddleware<TDependencies>
{    
    let result: RcdaChatMiddleware<TDependencies> = {
        dependencyFactory,
        sessionMiddleware: (session, next) => {
            let dependencies = result.dependencyFactory ? result.dependencyFactory() : null;
            rcdaMiddleware({ session, next }, dependencies);
        }
    };
    return result;
}