import rcdaChatMiddleware from "@/chat/utils/rcdaChatMiddleware";
import RcdaBotConversationData from "@/chat/models/RcdaBotConversationData";

export const conversationDataInitMiddleware = rcdaChatMiddleware(
    null,
    ({ session, next }) => {
        if (!session.conversationData.__initialized) {
            let rcdaConversationData = new RcdaBotConversationData();
            Object.assign(session.conversationData, rcdaConversationData);
            session.conversationData.__initialized = true;
        }
        next();
    });