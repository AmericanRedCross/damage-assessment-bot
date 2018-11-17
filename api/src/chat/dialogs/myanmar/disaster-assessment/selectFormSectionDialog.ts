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
        ({ session, localizer }) => {
            Prompts.choice(session, localizer.mm.askNextSectionToReport, 
            [
                localizer.mm.reportSectionNamePeople,
                localizer.mm.reportSectionNameSectors,
                localizer.mm.reportSectionNameRankings
            ], { 
                listStyle: ListStyle.button,
                retryPrompt: localizer.mm.invalidChoicePromptRetry
            });
        },
        ({ session, localizer, result }: RcdaChatStep<IPromptChoiceResult>) => {
            const selection =  result.response.entity;
            if (selection === localizer.mm.reportSectionNamePeople) {
                session.beginDialog(askAffectedPeopleDialog.id);
                return;
            }
            if (selection === localizer.mm.reportSectionNameSectors) {
                session.beginDialog(askSectorsDialog.id);
                return;
            }
            if (selection === localizer.mm.reportSectionNameRankings) {
                session.beginDialog(askRankingsDialog.id);
                return;
            }
        },
        ({ session, localizer }) => {
            Prompts.choice(session, "Would you like to report on anything else?", 
            [
                localizer.common.yes,
                localizer.common.no
            ], {
                listStyle: ListStyle.button,
                retryPrompt: localizer.mm.invalidChoicePromptRetry
            });
        },
        ({ session, localizer, result, next }) => {
            const selection = (<IPromptChoiceResult>result).response.entity;
            if (selection === localizer.common.yes) {
                session.beginDialog(selectFormSectionDialog.id);
                return;
            }
            if (selection === localizer.common.no) {
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