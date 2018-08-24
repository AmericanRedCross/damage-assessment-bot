import axios from "axios";
//import dayjs from "dayjs";
import UserSession from "@common/models/user/UserSession";
import LoginRequest from "@common/models/login/LoginRequest";
import LoginResponse from "@common/models/login/LoginResponse";

export default class AuthService {

    private static localStorageSessionKey = "sessionToken";

    public get hasActiveSession(): boolean {
        if (!this.userSession) {
            return false;
        }

        //let expirationDate = dayjs(this.userSession.expires);

        return true;//!!expirationDate;
    }

    public async logIn(username: string, password: string) {
        let loginRequest: LoginRequest = {
            username,
            password
        };

        let loginResponse = await axios.post<LoginResponse>("api/login", loginRequest);

        localStorage.setItem(AuthService.localStorageSessionKey, loginResponse.data.sessionToken);
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