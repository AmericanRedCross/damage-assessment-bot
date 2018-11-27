import MyanmarConversationData from "@/chat/models/MyanmarConversationData";
import { RcdaLanguages } from "@common/system/RcdaLanguages";

export default class RcdaBotConversationData {
    __initialized = false;
    language: RcdaLanguages = RcdaLanguages.English;
    mm = new MyanmarConversationData();
}