import BotServiceRepo from "@/repo/BotServiceRepo";
import ChatAuthResult from "@common/models/services/chat-auth/ChatAuthResult";

export default class ChatAuthService {

    constructor(private botServiceRepo: BotServiceRepo) {}

    public static getInstance() {
        return new ChatAuthService(BotServiceRepo.getInstance());
    }
    
    public async getAuthenticatedSession(userId: string): Promise<ChatAuthResult> {

        let token = await this.botServiceRepo.getChatAuthToken(userId);

        return token;
    }
}