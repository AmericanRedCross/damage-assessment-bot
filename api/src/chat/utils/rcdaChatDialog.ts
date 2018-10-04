import { Dialog, IDialogWaterfallStep, ITriggerActionOptions } from "botbuilder";
import { RcdaTypedSession, RcdaDialogDefinition, RcdaDialogWaterfallStep, RcdaChatDialog, RcdaChatDialogOptions, FrameworkDialogDefinition, RcdaDialogWaterfallStepContext } from "@/chat/utils/rcda-chat-types";

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
    dialogDataConstructor: new (session: RcdaTypedSession) => TDialogData,
    rcdaDialog: RcdaDialogDefinition<TDialogData, TDependencies>,
    options?: RcdaChatDialogOptions): RcdaChatDialog 
{    
    let dialog: FrameworkDialogDefinition;
    // is a function
    if (typeof rcdaDialog === "function") {
        dialog = standardDialogAdapter(rcdaDialog, dependencyFactory, dialogDataConstructor);
    } 
    else if (typeof rcdaDialog === "object") {
        // is an array of functions
        if ((<any>rcdaDialog).length !== undefined) {
            dialog = (<RcdaDialogWaterfallStep<TDialogData, TDependencies>[]>rcdaDialog).map(d => standardDialogAdapter(d, dependencyFactory, dialogDataConstructor))
        }
        // is an instance of the Dialog class
        else {
            //TODO how are dependencies made available to a class instance? does it construct it's own?
            dialog = <Dialog>rcdaDialog;
        }
    }
    
    return { id, dialog, options }
}

function standardDialogAdapter<TDialogData, TDependencies>(
    rcdaDialogWaterfallStep: RcdaDialogWaterfallStep<TDialogData, TDependencies>,
    dependencyFactory: () => TDependencies,
    dialogDataConstructor: new (session: RcdaTypedSession) => TDialogData): IDialogWaterfallStep 
{
    return function(session, result, next) {

        if (dialogDataConstructor && !session.dialogData.__rcdaDialogInitialized) {
            let dialogData = new dialogDataConstructor(session);
            Object.assign(session.dialogData, dialogData);
            session.dialogData.__rcdaDialogInitialized = true;
        }
        
        let dependencies = dependencyFactory ? dependencyFactory() : null;
        rcdaDialogWaterfallStep({ session, result, next }, dependencies);
    }
}