import { Dialog, IDialogWaterfallStep } from "botbuilder";
import { RcdaTypedSession, RcdaDialogDefinition, RcdaDialogWaterfallStep, RcdaChatDialog, RcdaChatDialogOptions, FrameworkDialogDefinition, RcdaDialogWaterfallStepContext } from "@/chat/utils/rcda-chat-types";
import RcdaChatLocalizer from "@/chat/localization/RcdaChatLocalizer";

type RcdaDialogDataFactory<TResult> = (args: { session: RcdaTypedSession, localizer: RcdaChatLocalizer, result: any }) => TResult;

export default function rcdaChatDialog<TDialogData, TDependencies>(
    id: string,
    dependencyFactory: () => TDependencies,
    rcdaDialog: RcdaDialogDefinition<TDialogData, TDependencies>,
    options?: RcdaChatDialogOptions): RcdaChatDialog 
{
    return rcdaChatDialogStateful(id, dependencyFactory, null, rcdaDialog, options);
}

export function rcdaChatDialogStateful<TDialogData, TDependencies>(
    id: string,
    dependencyFactory: () => TDependencies,
    dialogDataFactory: (args: { session: RcdaTypedSession, localizer: RcdaChatLocalizer, result: any }) => TDialogData,
    rcdaDialog: RcdaDialogDefinition<TDialogData, TDependencies>,
    options?: RcdaChatDialogOptions): RcdaChatDialog 
{    
    let dialog: FrameworkDialogDefinition;
    // is a function
    if (typeof rcdaDialog === "function") {
        dialog = standardDialogAdapter(rcdaDialog, dependencyFactory, dialogDataFactory);
    }
    else if (typeof rcdaDialog === "object") {
        // is an array of functions
        if ((<any>rcdaDialog).length !== undefined) {
            dialog = (<RcdaDialogWaterfallStep<TDialogData, TDependencies>[]>rcdaDialog).map(d => standardDialogAdapter(d, dependencyFactory, dialogDataFactory))
        }
        // is an instance of the Dialog class
        else {
            //TODO how are dependencies made available to a class instance? does it construct it's own?
            dialog = <Dialog>rcdaDialog;
        }
    }
    // apply prefix
    id = `*:${id}`;
    return { id , dialog, options }
}

function standardDialogAdapter<TDialogData, TDependencies>(
    rcdaDialogWaterfallStep: RcdaDialogWaterfallStep<TDialogData, TDependencies>,
    dependencyFactory: () => TDependencies,
    dialogDataFactory: (args: { session: RcdaTypedSession, localizer: RcdaChatLocalizer, result: any }) => TDialogData): IDialogWaterfallStep 
{
    return function(session, result, next) {

        let localizer = new RcdaChatLocalizer(session);

        if (dialogDataFactory && !session.dialogData.__rcdaDialogInitialized) {
            let dialogData = dialogDataFactory({ session, localizer, result });
            Object.assign(session.dialogData, dialogData);
            session.dialogData.__rcdaDialogInitialized = true;
        }
        
        let dependencies = dependencyFactory ? dependencyFactory() : null;
        rcdaDialogWaterfallStep({ session, result, next, localizer }, dependencies);
    }
}