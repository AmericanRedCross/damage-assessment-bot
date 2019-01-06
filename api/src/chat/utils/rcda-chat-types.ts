import { Dialog, IDialogWaterfallStep, Session, IDialogResult, ISessionMiddleware, ITriggerActionOptions, IEventMiddleware, IEvent } from "botbuilder";
import RcdaBotConversationData from "@/chat/models/RcdaBotConversationData";
import RcdaChatLocalizer from "@/chat/localization/RcdaChatLocalizer";
import RcdaBotUserData from "@/chat/models/RcdaBotUserData";

export interface RcdaTypedSession<TDialogData extends {}={}> extends Session {
    dialogData: TDialogData,
    conversationData: RcdaBotConversationData,
    userData: RcdaBotUserData
}

type DefaultDialogWaterfallStepResult = any|IDialogResult<any>;

export interface RcdaDialogWaterfallStepContext<TDialogData, TResult=DefaultDialogWaterfallStepResult> { 
    session: RcdaTypedSession<TDialogData>, 
    result?: TResult, 
    next?: (results?: IDialogResult<any>) => void,
    localizer: RcdaChatLocalizer
};

//shorthand alias
export type RcdaChatStep<TResult=DefaultDialogWaterfallStepResult, TDialogData=any> = RcdaDialogWaterfallStepContext<TDialogData, TResult>;

export interface RcdaDialogWaterfallStep<TDialogData, TDependencies> {
    (context: RcdaDialogWaterfallStepContext<TDialogData>, dependencies: TDependencies): void;
}

export type FrameworkDialogDefinition = Dialog|IDialogWaterfallStep[]|IDialogWaterfallStep;

export type RcdaDialogDefinition<TDialogData, TDependencies> = Dialog|RcdaDialogWaterfallStep<TDialogData, TDependencies>[]|RcdaDialogWaterfallStep<TDialogData, TDependencies>;

export interface RcdaChatDialogOptions {
    triggers?: ITriggerActionOptions[],
    references?: RcdaChatDialog[] | (() => RcdaChatDialog[])
}

export interface RcdaChatDialog {
    id: string; 
    dialog: FrameworkDialogDefinition;
    options?: RcdaChatDialogOptions
}

export interface RcdaSessionMiddleware<TDependencies> {
    (context: { session: RcdaTypedSession, localizer: RcdaChatLocalizer ,next: Function }, dependencies: TDependencies): void;
}

export interface RcdaChatMiddleware<TDependencies> {
    dependencyFactory: () => TDependencies; 
    sessionMiddleware: ISessionMiddleware;
}