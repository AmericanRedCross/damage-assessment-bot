import RcdaApiClient from "@/services/utils/RcdaApiClient";
import UserSession from "@common/models/resources/UserSession";
import LoginRequest from "@common/models/services/login/LoginRequest";
import LoginResponse from "@common/models/services/login/LoginResponse";
import RcdaStorageClient from "@/services/utils/RcdaStorageClient";

export default class AuthService {

    constructor(private apiClient: RcdaApiClient, private storageClient: RcdaStorageClient) { }

    public get hasActiveSession(): boolean {

        let userSession = this.storageClient.apiSession;
        if (!userSession) {
            return false;
        }

        return Date.now() < (userSession.exp * 1000 /* convert to milliseconds */);
    }

    public async login(username: string, password: string): Promise<boolean> {
        this.storageClient.clear();

        let loginRequest: LoginRequest = {
            username,
            password
        };
        let loginResponse = await this.apiClient.post<LoginResponse>("api/v1/login", loginRequest);
        if (loginResponse.status === 400) {
            return false;
        }
        else if (loginResponse.status === 200) {
            this.storageClient.apiSessionToken = loginResponse.data.sessionToken;
            return true;
        }
        else {
            throw loginResponse.data;
        }
    };

    public async logout() {
        this.storageClient.clear();
    }
}