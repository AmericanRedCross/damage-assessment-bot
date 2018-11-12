import { ListStyle, Prompts, IPromptChoiceResult } from "botbuilder";
import rcdaChatDialog from "@/chat/utils/rcdaChatDialog";
import { askSectorsDialog } from "@/chat/dialogs/myanmar/disaster-assessment/questions/askSectors";
import { askRankingsDialog } from "@/chat/dialogs/myanmar/disaster-assessment/questions/askRankings";
import { askAffectedPeopleDialog } from "@/chat/dialogs/myanmar/disaster-assessment/questions/askAffectedPeopleDialog";
import { RcdaChatStep } from "@/chat/utils/rcda-chat-types";

export const selectFormSectionDialog = rcdaChatDialog(
    "/selectFormSection",
    null,
    [
        ({ session }) => {
            Prompts.choice(session, "What do you want to report on?", 
            [
                "People",
                "Sectors",
                "Rankings"
            ], { 
                listStyle: ListStyle.button,
                retryPrompt: "Sorry, I didn't understand that. Please select one of the listed options."
            });
        },
        ({ session, result }: RcdaChatStep<IPromptChoiceResult>) => {
            const selection =  result.response.entity;
            if (selection === "People") {
                session.beginDialog(askAffectedPeopleDialog.id);
                return;
            }
            if (selection === "Sectors") {
                session.beginDialog(askSectorsDialog.id);
                return;
            }
            if (selection === "Rankings") {
                session.beginDialog(askRankingsDialog.id);
                return;
            }
        },
        ({ session }) => {
            Prompts.choice(session, "Would you like to report on anything else?", 
            [
                "Yes",
                "No"
            ], {
                listStyle: ListStyle.button,
                retryPrompt: "Sorry, I didn't understand that. Please select one of the listed options."
            });
        },
        ({ session, result, next }) => {
            const selection = (<IPromptChoiceResult>result).response.entity;
            if (selection === "Yes") {
                session.beginDialog(selectFormSectionDialog.id);
                return;
            }
            if (selection === "No") {
                next();
                return;
            }
        }
    ], {
        references: [
            askSectorsDialog, 
            askRankingsDialog, 
            askAffectedPeopleDialog
        ]
    })