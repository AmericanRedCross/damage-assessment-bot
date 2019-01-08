import { DirectLine } from "botframework-directlinejs";
import RcdaApiClient from "@/services/utils/RcdaApiClient";
import RcdaStorageClient from "@/services/utils/RcdaStorageClient";
import ChatAuthResult from "@common/models/services/chat-auth/ChatAuthResult";

export default class RcdaChatClient {

    constructor(private apiClient: RcdaApiClient, private storageClient: RcdaStorageClient) { }
    
    private directLineConnection!: DirectLine;

    getConnection(): DirectLine {
        return this.directLineConnection;
    }

    public async initializeConnection() {
        
        let chatSession = this.storageClient.chatSession;
        let tenMinutesFromNow = Date.now() + (10 * 60 * 1000);
        if (chatSession && chatSession.expires > tenMinutesFromNow) {
            this.directLineConnection = new DirectLine({
                token: chatSession.token
            });
            return;
        }
        
        let sessionToken = this.storageClient.apiSessionToken;
        let headers = { "Authorization": `Bearer ${sessionToken}` };
        let response = await this.apiClient.post<ChatAuthResult>("api/v1/chat/auth", null,{ headers });
        
        chatSession = response.data;
        this.storageClient.chatSession = chatSession;

        this.directLineConnection = new DirectLine({
            token: chatSession.token,
        });
    }

    public async sendEvent(eventName: string, value: string) {
        let userSession = this.storageClient.apiSession;
        let userId = userSession ? userSession.userId : "";
        let response = await this.directLineConnection.postActivity({type: "event", value: value, from: { id: userId }, name: eventName}).toPromise();
    }
}