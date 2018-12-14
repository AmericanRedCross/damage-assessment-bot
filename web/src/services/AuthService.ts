import RcdaApiClient from "@/services/utils/RcdaApiClient";
import UserSession from "@common/models/resources/UserSession";
import LoginRequest from "@common/models/services/login/LoginRequest";
import LoginResponse from "@common/models/services/login/LoginResponse";
import axios from "axios";

export default class AuthService {

    constructor(private apiClient: RcdaApiClient) { }

    private static localStorageSessionKey = "sessionToken";

    public get hasActiveSession(): boolean {
        if (!this.userSession) {
            return false;
        }

        return Date.now() < (this.userSession.exp * 1000 /* convert to milliseconds */);
    }

    public async login(username: string, password: string): Promise<boolean> {
        let loginRequest: LoginRequest = {
            username,
            password
        };
        let loginResponse = await this.apiClient.post<LoginResponse>("api/login", loginRequest);
        if (loginResponse.status === 400) {
            return false;
        }
        else if (loginResponse.status === 200) {
            localStorage.setItem(AuthService.localStorageSessionKey, loginResponse.data.sessionToken);
            return true;
        }
        else {
            throw loginResponse.data;
        }
    };

    private get userSession(): UserSession|null {
        let sessionToken = localStorage.getItem(AuthService.localStorageSessionKey);
        if (sessionToken) {
            var base64Url = sessionToken.split('.')[1];
            var base64 = base64Url.replace('-', '+').replace('_', '/');
            return JSON.parse(window.atob(base64));
        }
        return null;
    }
}