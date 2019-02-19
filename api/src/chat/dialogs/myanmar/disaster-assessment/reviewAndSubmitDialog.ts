import { ListStyle, Prompts, IPromptChoiceResult } from "botbuilder";
import rcdaChatDialog from "@/chat/utils/rcdaChatDialog";
import { reviewAffectedPeopleDialog } from "@/chat/dialogs/myanmar/disaster-assessment/review/reviewAffectedPeopleDialog";
import { reviewSectorsDialog } from "@/chat/dialogs/myanmar/disaster-assessment/review/reviewSectorsDialog";
import { reviewRankingsDialog } from "@/chat/dialogs/myanmar/disaster-assessment/review/reviewRankingsDialog";

export const reviewAndSubmitDialog = rcdaChatDialog(
    "/reviewAndSubmit",
    null,
    [
        ({ session, localizer }) => {
            Prompts.choice(session, localizer.mm.askIfReadyToSubmit, 
            [
                localizer.mm.reviewReportOption,
                localizer.mm.submitReportOption
            ], { 
                listStyle: ListStyle.button,
                retryPrompt: localizer.mm.invalidChoicePromptRetry
            });
        },
        ({ session, localizer, result }) => {
            const selection = (<IPromptChoiceResult>result).response.entity;
            if (selection === localizer.mm.submitReportOption) {
                session.endDialog();
                return;
            }
            if (selection === localizer.mm.reviewReportOption) {
                Prompts.choice(session, localizer.mm.askWhichSectionToReview, 
                [
                    localizer.mm.reportSectionNamePeople,
                    localizer.mm.reportSectionNameSectors,
                    localizer.mm.reportSectionNameRankings
                ], { 
                    listStyle: ListStyle.button,
                    retryPrompt: localizer.mm.invalidChoicePromptRetry
                });
                return;
            }
        },
        ({ session, result, localizer }) => {
            const selection = (<IPromptChoiceResult>result).response.entity;
            if (selection === localizer.mm.reportSectionNamePeople) {
                session.beginDialog(reviewAffectedPeopleDialog.id);
                return;
            }
            if (selection === localizer.mm.reportSectionNameSectors) {
                session.beginDialog(reviewSectorsDialog.id);
                return;
            }
            if (selection === localizer.mm.reportSectionNameRankings) {
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