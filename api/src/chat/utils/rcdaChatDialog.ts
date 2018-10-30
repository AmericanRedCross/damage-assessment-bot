import { Dialog, IDialogWaterfallStep, ITriggerActionOptions } from "botbuilder";
import { RcdaDialogDefinition, RcdaDialogWaterfallStep, RcdaChatDialog, RcdaChatDialogOptions, FrameworkDialogDefinition, RcdaDialogWaterfallStepContext } from "@/chat/utils/rcda-chat-types";

export default function rcdaChatDialog<TDependencies>(
    id: string, 
    dependencyFactory: () => TDependencies,
    rcdaDialog: RcdaDialogDefinition<TDependencies>,
    options?: RcdaChatDialogOptions): RcdaChatDialog 
{    
    let dialog: FrameworkDialogDefinition;
    // is a function
    if (typeof rcdaDialog === "function") {
        dialog = standardDialogAdapter(rcdaDialog, dependencyFactory);
    } 
    else if (typeof rcdaDialog === "object") {
        // is an array of functions
        if ((<any>rcdaDialog).length !== undefined) {
            dialog = (<RcdaDialogWaterfallStep<TDependencies>[]>rcdaDialog).map(d => standardDialogAdapter(d, dependencyFactory))
        }
        // is an instance of the Dialog class
        else {
            //TODO how are dependencies made available to a class instance? does it construct it's own?
            dialog = <Dialog>rcdaDialog;
        }
    }
    
    return { id, dialog, options }
}

function standardDialogAdapter<TDependencies>(
    rcdaDialogWaterfallStep: RcdaDialogWaterfallStep<TDependencies>,
    dependencyFactory: () => TDependencies): IDialogWaterfallStep 
{
    return function(session, result, skip) {
        let dependencies = dependencyFactory ? dependencyFactory() : null;
        rcdaDialogWaterfallStep({ session, result, skip }, dependencies);
    }
}