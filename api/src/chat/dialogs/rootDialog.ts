import rcdaChatDialog from "@/chat/utils/rcdaChatDialog";
import { myanmarDisasterAssessmentDialog } from "@/chat/dialogs/disaster-assessment/myanmar/myanmarDisasterAssessmentDialog";
import RcdaPrompts from "@/chat/prompts/RcdaPrompts";

export default rcdaChatDialog(
    "/",
    null,
    [
        ({ session, result }) => {
            session.beginDialog(myanmarDisasterAssessmentDialog.id)
        }
    ]);
