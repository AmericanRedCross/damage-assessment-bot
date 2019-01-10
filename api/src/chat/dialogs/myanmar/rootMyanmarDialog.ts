import { ListStyle, Prompts, IPromptChoiceResult } from "botbuilder";
import rcdaChatDialog from "@/chat/utils/rcdaChatDialog";
import { createReportDialog } from "@/chat/dialogs/myanmar/disaster-assessment/createReportDialog";
import MyanmarConversationData from "@/chat/models/MyanmarConversationData";
import { RcdaChatStep } from "@/chat/utils/rcda-chat-types";

export const rootMyanmarDialog = rcdaChatDialog(
    "/rootMyanmar",
    null,
    [
        ({ session, localizer }) => {            
            if (!session.conversationData.hasBeenWelcomed) {                
                session.send("Welcome to the Red Cross Disaster Assessment chat bot");
                session.conversationData.hasBeenWelcomed = true;
                session.delay(1500);
            }

            // prompt choice of 'start report' or 'help'
            Prompts.choice(session, localizer.mm.promptUserToSelectChatbotFeature, 
            [
                localizer.mm.startDisasterAssessmentOption,
                localizer.mm.getHelpOption
            ], {
                listStyle: ListStyle.button,
                retryPrompt: localizer.mm.invalidChoicePromptRetry
            });
        },
        ({ session, result, localizer }: RcdaChatStep<IPromptChoiceResult>) => {
            const selection = result.response.entity;
            if (selection === localizer.mm.startDisasterAssessmentOption) {
                // begin 'start report' dialog
                session.beginDialog(createReportDialog.id);
            }
            if (selection === localizer.mm.getHelpOption) {
                // not yet supported, start over
                session.send(localizer.mm.choiceNotYetSupportedPromptRetry);
                session.delay(200);
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
