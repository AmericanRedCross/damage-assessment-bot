import { ListStyle, Prompts, IPromptChoiceResult } from "botbuilder";
import rcdaChatDialog from "@/chat/utils/rcdaChatDialog";
import { reviewAffectedPeopleDialog } from "@/chat/dialogs/myanmar/disaster-assessment/review/reviewAffectedPeopleDialog";
import { reviewSectorsDialog } from "@/chat/dialogs/myanmar/disaster-assessment/review/reviewSectorsDialog";
import { reviewRankingsDialog } from "@/chat/dialogs/myanmar/disaster-assessment/review/reviewRankingsDialog";

export const reviewAndSubmitDialog = rcdaChatDialog(
    "/reviewAndSubmit",
    null,
    [
        ({ session }) => {
            Prompts.choice(session, "Are you ready to submit the report?", 
            [
                "Review",
                "Submit"
            ], { 
                listStyle: ListStyle.button,
                retryPrompt: "Sorry, I didn't understand that. Please select one of the listed options."
            });
        },
        ({ session, result }) => {
            const selection = (<IPromptChoiceResult>result).response.entity;
            if (selection === "Submit") {
                session.endDialog();
                return;
            }
            if (selection === "Review") {
                Prompts.choice(session, "Which section would you like to review?", 
                [
                    "People",
                    "Sectors",
                    "Rankings"
                ], { 
                    listStyle: ListStyle.button,
                    retryPrompt: "Sorry, I didn't understand that. Please select one of the listed options."
                });
                return;
            }
        },
        ({ session, result }) => {
            const selection = (<IPromptChoiceResult>result).response.entity;
            if (selection === "People") {
                session.beginDialog(reviewAffectedPeopleDialog.id);
                return;
            }
            if (selection === "Sectors") {
                session.beginDialog(reviewSectorsDialog.id);
                return;
            }
            if (selection === "Rankings") {
                session.beginDialog(reviewRankingsDialog.id);
                return;
            }
        },
        ({ session }) => {
            session.replaceDialog(reviewAndSubmitDialog.id);
        }
    ], {
        references: [
            reviewAffectedPeopleDialog,
            reviewSectorsDialog, 
            reviewRankingsDialog            
        ]
    })