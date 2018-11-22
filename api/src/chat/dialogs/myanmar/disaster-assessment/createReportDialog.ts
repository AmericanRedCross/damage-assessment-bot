import { ListStyle, Prompts, IPromptChoiceResult } from "botbuilder";
import rcdaChatDialog from "@/chat/utils/rcdaChatDialog";
import DisasterAssessmentRepo from "@/repo/DisasterAssessmentRepo";
import { askUserInfoDialog } from "@/chat/dialogs/myanmar/disaster-assessment/questions/askUserInfo";
import { selectFormSectionDialog } from "@/chat/dialogs/myanmar/disaster-assessment/selectFormSectionDialog";
import { reviewAndSubmitDialog } from "@/chat/dialogs/myanmar/disaster-assessment/reviewAndSubmitDialog";

export const createReportDialog = rcdaChatDialog(
    "/createReport",
    () => ({
        disasterAssessmentRepo: DisasterAssessmentRepo.getInstance()
    }),
    [
        ({ session }) => {
            session.beginDialog(askUserInfoDialog.id);
        },
        ({ session }) => {
            session.beginDialog(selectFormSectionDialog.id);
        },
        ({ session }) => {
            session.beginDialog(reviewAndSubmitDialog.id);
        },
        async ({ session, localizer }, { disasterAssessmentRepo }) => {

            // Save the report - TODO review format of report object
            //await disasterAssessmentRepo.create({ id: });
            
            session.endDialog(localizer.mm.confirmReportSubmitted)
        }
    ],
    {
        references: [askUserInfoDialog, selectFormSectionDialog, reviewAndSubmitDialog]
    });