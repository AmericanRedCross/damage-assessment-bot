import rcdaChatMiddleware from "@/chat/utils/rcdaChatMiddleware";
import unsupportedChannelDialog from "@/chat/dialogs/unsupportedChannelDialog";

export const channelDetectionMiddleware = rcdaChatMiddleware(
    null,
    ({ session, next }) => {
        if (session.message.address.channelId !== "webchat") {
            session.beginDialog(unsupportedChannelDialog.id);
            return;
        }
        next();
    });