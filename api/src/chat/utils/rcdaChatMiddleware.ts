import { RcdaSessionMiddleware, RcdaChatMiddleware } from "@/chat/utils/rcda-chat-types";
import RcdaChatLocalizer from "../localization/RcdaChatLocalizer";

export default function rcdaChatMiddleware<TDependencies>(
    dependencyFactory: () => TDependencies,
    rcdaMiddleware: RcdaSessionMiddleware<TDependencies>): RcdaChatMiddleware<TDependencies>
{    
    let result: RcdaChatMiddleware<TDependencies> = {
        dependencyFactory,
        sessionMiddleware: (session, next) => {
            let dependencies = result.dependencyFactory ? result.dependencyFactory() : null;
            let localizer = new RcdaChatLocalizer(session);
            rcdaMiddleware({ session, next, localizer }, dependencies);
        }
    };
    return result;
}