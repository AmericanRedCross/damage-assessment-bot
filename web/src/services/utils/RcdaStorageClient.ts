import ChatAuthResult from "@common/models/services/chat-auth/ChatAuthResult";
import UserSession from "@common/models/resources/UserSession";
import { RcdaLanguages } from "@common/system/RcdaLanguages";

export default class RcdaStorageClient {

    private readonly apiSessionTokenKey = "apiSessionToken";
    public get apiSessionToken(): string|null {
        return sessionStorage.getItem(this.apiSessionTokenKey)
    }

    public set apiSessionToken(value: string|null) {
        if (value) {
            sessionStorage.setItem(this.apiSessionTokenKey, value);
        }
        else {
            sessionStorage.removeItem(this.apiSessionTokenKey);
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
        return JSON.parse(sessionStorage.getItem(this.chatSessionKey) || "null");
    }

    public set chatSession(value: ChatAuthResult|null) {
        sessionStorage.setItem(this.chatSessionKey, JSON.stringify(value));
    }
    
    private readonly languageKey = "language";
    public get language(): RcdaLanguages|null {
        return (<RcdaLanguages>localStorage.getItem(this.languageKey)) || null;
    }

    public set language(value: RcdaLanguages|null) {
        localStorage.setItem(this.languageKey, <string>value || "");
    }

    clear() {
        sessionStorage.removeItem(this.apiSessionTokenKey);
        sessionStorage.removeItem(this.chatSessionKey);
        // intentionally leaves language intact
    }
}