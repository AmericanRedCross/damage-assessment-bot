import LoginRepo from "@/repo/LoginRepo";
import LoginResponse from "@common/models/login/LoginResponse";
import LoginRequest from "@common/models/login/LoginRequest";
import UserRepo from "@/repo/UserRepo";
import UserSession from "@common/models/user/UserSession";
import RcdaClientError from "@/common/errors/RcdaClientError";

export default class LoginService {
    constructor(
        private loginRepo: LoginRepo,
        private userRepo: UserRepo) {}

    public static getInstance() {
        return new LoginService(
            LoginRepo.getInstance(), 
            UserRepo.getInstance());
    }

    public async login(loginRequest: LoginRequest): Promise<LoginResponse> {
        if (!await this.loginRepo.verifyLogin(loginRequest)) {
            throw new RcdaClientError("The provided authentication credentials are invalid");
        }

        //TODO use user id as it is stored in the auth response
        let userId = loginRequest.username;
        let user = await this.userRepo.get(userId);
        if (!user) {
            user = await this.userRepo.add({ id: userId, roles: [], chatChannels: {} });
        }

        return {
            sessionToken: await this.loginRepo.getSessionToken(user)
        };
    }

    public async verify(sessionToken: string): Promise<UserSession> {
        return await this.loginRepo.parseSessionToken(sessionToken);
    }
}