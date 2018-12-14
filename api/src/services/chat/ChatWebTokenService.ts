import BotServiceRepo from "@/repo/BotServiceRepo";
import ChatWebTokenResult from "@common/models/services/chat-web-token/ChatWebTokenResult";

export default class ChatWebTokenService {

    constructor(private botServiceRepo: BotServiceRepo) {}

    public static getInstance() {
        return new ChatWebTokenService(BotServiceRepo.getInstance());
    }
    
    public async get(): Promise<ChatWebTokenResult> {

        let token = await this.botServiceRepo.getWebChatToken();

        return {
            token: token
        };
    }
}