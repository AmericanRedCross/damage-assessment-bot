import ChatAuthResult from "@common/models/services/chat-auth/ChatAuthResult";
import UserSession from "@common/models/resources/UserSession";

export default class RcdaStorageClient {

    private readonly apiSessionTokenKey = "apiSessionToken";
    public get apiSessionToken(): string|null {
        return localStorage.getItem(this.apiSessionTokenKey)
    }

    public set apiSessionToken(value: string|null) {
        if (value) {
            localStorage.setItem(this.apiSessionTokenKey, value);
        }
        else {
            localStorage.removeItem(this.apiSessionTokenKey);
        }
    }

    public get apiSession(): UserSession|null {
        let sessionToken = this.apiSessionToken;
        if (sessionToken) {
            var base64Url = sessionToken.split('.')[1];
            var base64 = base64Url.replace('-', '+').replace('_', '/');
            return <UserSession>JSON.parse(window.atob(base64));
        }
        return null;
    }

    private readonly chatSessionKey = "chatSession";
    public get chatSession(): ChatAuthResult|null {
        return JSON.parse(localStorage.getItem(this.chatSessionKey) || "null");
    }

    public set chatSession(value: ChatAuthResult|null) {
        localStorage.setItem(this.chatSessionKey, JSON.stringify(value));
    }

    clear() {
        localStorage.removeItem(this.apiSessionTokenKey);
        localStorage.removeItem(this.chatSessionKey);
    }
}