import { IEvent } from "botbuilder";
import { RcdaTypedSession } from "@/chat/utils/rcda-chat-types";

interface RcdaChatEventDefinition<TDependencies> {
    name: string,
    dependencyFactory: () => TDependencies,
    eventHandler: (event: IEvent, session: RcdaTypedSession, dependencies: TDependencies) => void,
    wrapper: (event: IEvent) => void;
}

export default function rcdaChatEvent<TDependencies>(
    name: string, 
    dependencyFactory: () => TDependencies, 
    eventHandler: (event: IEvent, session: RcdaTypedSession, dependencies: TDependencies) => void): RcdaChatEventDefinition<TDependencies> {

    return {
        name,
        dependencyFactory,
        eventHandler,
        wrapper(event) {
            
        }
    }
}