import rcdaChatDialog from "@/chat/utils/rcdaChatDialog";
import { rootMyanmarDialog } from "@/chat/dialogs/myanmar/rootMyanmarDialog";
import { selectLanguageDialog } from "@/chat/dialogs/selectLanguageDialog";

export const rootDialog = rcdaChatDialog(
    "/",
    null,
    [
        ({ session, next }) => {
            if (!session.conversationData.language) {
                session.beginDialog(selectLanguageDialog.id);
            }
            else {
                next();
            }
        },
        ({ session }) => {
            // eventually this can be expanded to support more than one country. for now it can assume country is myanmar.
            session.beginDialog(rootMyanmarDialog.id);
        }
    ],
    {
        references: [ rootMyanmarDialog, selectLanguageDialog ]
    });