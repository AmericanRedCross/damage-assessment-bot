import axios, { AxiosInstance, AxiosError } from "axios";
import ChatAuthResult from "@common/models/services/chat-auth/ChatAuthResult";

export interface BotServiceRepoOptions {
    directLineSecret: string
}

export default class BotServiceRepo {
    constructor(private axios: AxiosInstance, private options: BotServiceRepoOptions) {}

    static getInstance() {
        return new BotServiceRepo(axios, { 
            directLineSecret: process.env["BotServiceDirectLineSecret"]
        });
    }

    public async getChatAuthToken(userId: string): Promise<ChatAuthResult> {
        
        let result = await this.axios.post<DirectLineTokenResponse>(`https://directline.botframework.com/v3/directline/tokens/generate`, {
            user: {
                // the dl_ prefix is required by direct line. it will be included in the chat session user id and must be removed to get the real user id.
                id: `dl_${userId}`
            }
        }, {
            headers: {
                "Authorization": `Bearer ${this.options.directLineSecret}`
            }
        });
        
        return {
            conversationId: result.data.conversationId,
            token: result.data.token,
            expires: Date.now() + (result.data.expires_in * 1000)
        };
    }
}

interface DirectLineTokenResponse {
    conversationId: string;
    token: string;
    expires_in: number;
}