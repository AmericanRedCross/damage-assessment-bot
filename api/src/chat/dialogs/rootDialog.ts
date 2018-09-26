import rcdaChatDialog from "@/chat/utils/rcdaChatDialog";
import { myanmarDisasterAssessmentDialog } from "@/chat/dialogs/disaster-assessment/myanmar/myanmarDisasterAssessmentDialog";

export default rcdaChatDialog(
    "/",
    null,
    [
        ({ session, result }) => {
            session.beginDialog(myanmarDisasterAssessmentDialog.id)
        }
    ]);
