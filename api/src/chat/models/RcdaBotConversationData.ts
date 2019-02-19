import MyanmarConversationData from "@/chat/models/MyanmarConversationData";

export default class RcdaBotConversationData {
    __initialized = false;
    hasBeenWelcomed = false;
    mm = new MyanmarConversationData();
}