import { IEvent } from "botbuilder";
import { RcdaTypedSession, RcdaChatDialog } from "@/chat/utils/rcda-chat-types";
import RcdaChatLocalizer from "@/chat/localization/RcdaChatLocalizer";
import rcdaChatDialog from "./rcdaChatDialog";

export interface RcdaChatEventDefinition<TDependencies> {
    name: string,
    dependencyFactory: () => TDependencies,
    eventHandler: (value: RcdaEventArgs, dependencies: TDependencies) => void,
    config: RcdaEventConfig
}

export default function rcdaChatEvent<TDependencies>(
    name: string, 
    dependencyFactory: () => TDependencies, 
    eventHandler: (args: RcdaEventArgs, dependencies: TDependencies) => void,
    config: RcdaEventConfig): RcdaChatEventDefinition<TDependencies> {

    return {
        name,
        dependencyFactory,
        eventHandler,
        config
    };
}

interface RcdaEventArgs {
    value: string,
    session: RcdaTypedSession, 
    localizer: RcdaChatLocalizer
}

interface RcdaEventConfig {
    references: () => RcdaChatDialog[]
}