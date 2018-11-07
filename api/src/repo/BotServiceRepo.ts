import axios, { AxiosInstance, AxiosError } from "axios";

export interface BotServiceRepoOptions {
    webChatSecret: string
}

export default class BotServiceRepo {
    constructor(private axios: AxiosInstance, private options: BotServiceRepoOptions) {}

    static getInstance() {
        return new BotServiceRepo(axios, { 
            webChatSecret: process.env["BotServiceWebChatSecret"]
        });
    }

    public async getWebChatToken(): Promise<string> {
        
        let result = await this.axios.get<string>(`https://webchat.botframework.com/api/tokens`, {
            headers: {
                "Authorization": `BotConnector ${this.options.webChatSecret}`
            }
        });
        
        return result.data;
    }
}