
import { DirectLine } from 'botframework-directlinejs';
import RcdaChatClient from "@/services/utils/RcdaChatClient";
import { RcdaLanguages } from "@common/system/RcdaLanguages";

export default class ChatService {

    constructor(private chatClient: RcdaChatClient) { }
    
    public async getChatConnection(useCached: boolean): Promise<DirectLine> {

        let connection = this.chatClient.getConnection();

        if (!useCached || !connection) {
            await this.chatClient.initializeConnection();
            connection = this.chatClient.getConnection();
        }
 
        return connection;
    }

    public async setChatLanguage(language: RcdaLanguages) {
        
        if (!this.chatClient.getConnection()) {
            await this.chatClient.initializeConnection();
        }

        await this.chatClient.sendEvent("setLanguage", language);
    }
}