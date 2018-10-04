import { ListStyle, Prompts, IPromptChoiceResult } from "botbuilder";
import rcdaChatDialog from "@/chat/utils/rcdaChatDialog";
import { createReportDialog } from "@/chat/dialogs/myanmar/disaster-assessment/createReportDialog";
import MyanmarConversationData from "@/chat/models/MyanmarConversationData";

export const rootMyanmarDialog = rcdaChatDialog(
    "/rootMyanmar",
    null,
    [
        ({ session }) => {
            Prompts.choice(session, "What can I assist with?", 
            [
                "Start reporting on a disaster",
                "Help"
            ], { 
                listStyle: ListStyle.button,
                retryPrompt: "Sorry, I didn't understand that. Please select one of the listed options."
            });
        },
        ({ session, result }) => {
            const selection = (<IPromptChoiceResult>result).response.entity;
            if (selection === "Start reporting on a disaster") {
                session.beginDialog(createReportDialog.id);
            }
            if (selection === "Help") {
                session.send("Not yet implemented, please select another option");
                session.delay(200)
                session.replaceDialog(rootMyanmarDialog.id);
            }
        },
        ({ session }) => {
            // report has been submitted, clear all myanmar conversation data
            session.conversationData.mm = new MyanmarConversationData();
        }
    ], {
        references: [createReportDialog]
    });
