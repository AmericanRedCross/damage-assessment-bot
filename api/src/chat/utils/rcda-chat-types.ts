import { Dialog, IDialogWaterfallStep, Session, IDialogResult, ISessionMiddleware } from "botbuilder";

export interface RcdaDialogWaterfallStepContext { 
    session: Session, 
    result?: any | IDialogResult<any>, 
    skip?: (results?: IDialogResult<any>) => void
};

export interface RcdaDialogWaterfallStep<TDependencies> {
    (context: RcdaDialogWaterfallStepContext, dependencies: TDependencies): void;
}

export type FrameworkDialogDefinition = Dialog|IDialogWaterfallStep[]|IDialogWaterfallStep;

export type RcdaDialogDefinition<TDependencies> = Dialog|RcdaDialogWaterfallStep<TDependencies>[]|RcdaDialogWaterfallStep<TDependencies>;

export interface RcdaChatDialog {
    id: string; 
    dialog: FrameworkDialogDefinition;
}

export interface RcdaSessionMiddleware<TDependencies> {
    (context: { session: Session, next: Function }, dependencies: TDependencies): void;
}

export interface RcdaChatMiddleware<TDependencies> {
    dependencyFactory: () => TDependencies; 
    sessionMiddleware: ISessionMiddleware;
}