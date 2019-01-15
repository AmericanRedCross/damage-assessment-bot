import rcdaChatDialog from "@/chat/utils/rcdaChatDialog";
import { rootMyanmarDialog } from "@/chat/dialogs/myanmar/rootMyanmarDialog";

export const rootDialog = rcdaChatDialog(
    "/",
    null,
    [
        ({ session }) => {
            // eventually this can be expanded to support more than one country. for now it can assume country is myanmar.
            session.beginDialog(rootMyanmarDialog.id);
        }
    ],
    {
        references: [ rootMyanmarDialog ]
    });