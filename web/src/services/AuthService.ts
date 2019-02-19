import RcdaApiClient from "@/services/utils/RcdaApiClient";
import UserSession from "@common/models/resources/UserSession";
import LoginRequest from "@common/models/services/login/LoginRequest";
import LoginResponse from "@common/models/services/login/LoginResponse";
import RcdaStorageClient from "@/services/utils/RcdaStorageClient";
import RcdaReactiveValue from "@/services/utils/RcdaReactiveValue";
import RcdaWebLocalizer from "@/localization/RcdaWebLocalizer";
import { RcdaLanguages } from "@/../../common/bin/system/RcdaLanguages";

export default class AuthService {

    constructor(private apiClient: RcdaApiClient, private storageClient: RcdaStorageClient) {
        if (!this.hasActiveSession) {
            this.logout();
        }
        this.scheduleSessionTimeoutWarning();
    }

    private loginStatus = new RcdaReactiveValue(this.hasActiveSession);

    public get hasActiveSession(): boolean {

        let userSession = this.storageClient.apiSession;
        if (!userSession) {
            return false;
        }

        return Date.now() < (userSession.exp * 1000 /* convert to milliseconds */);
    }

    public async login(username: string, password: string): Promise<boolean> {
        this.logout();

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
            this.loginStatus.value = true;
            this.scheduleSessionTimeoutWarning();
            return true;
        }
        else {
            throw loginResponse.data;
        }
    };

    private lastTimeoutId: number|null = null;
    private scheduleSessionTimeoutWarning() {

        if (this.lastTimeoutId) {
            clearTimeout(this.lastTimeoutId);
            this.lastTimeoutId = null;
        }
        
        let apiSession = this.storageClient.apiSession;
        if (apiSession) {           
            const remainingTime = (apiSession.exp * 1000) - Date.now();
            const _this = this;
            this.lastTimeoutId = setTimeout(() => {
                _this.logout();
                const localizer = new RcdaWebLocalizer(_this.storageClient.language || RcdaLanguages.English);
                alert(localizer.common.sessionTimeoutMessage);
            }, remainingTime);
        }
    }

    public async logout() {
        this.storageClient.clear();
        this.loginStatus.value = false;
    }

    public onLoginStatusChange(callback: (isSignedIn: boolean) => void) {
        this.loginStatus.subscribe(callback);
    }
}