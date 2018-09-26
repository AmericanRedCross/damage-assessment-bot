import IfrcGoAuthRepo from "@/repo/IfrcGoAuthRepo";
import LoginResponse from "@common/models/services/login/LoginResponse";
import LoginRequest from "@common/models/services/login/LoginRequest";
import UserRepo from "@/repo/UserRepo";
import UserSession from "@common/models/resources/UserSession";
import UserModel from "@common/models/resources/UserModel";
import RcdaError, { RcdaErrorTypes } from "@common/system/RcdaError";
import RcdaAuthenticationProviders from "@common/system/RcdaAuthenticationProviders";
import SessionUtility from "@/services/utils/SessionUtility";
import uuid = require("uuid");

export default class LoginService {
    constructor(
        private ifrcGoAuthRepo: IfrcGoAuthRepo,
        private userRepo: UserRepo,
        private sessionUtility: SessionUtility) {}

    public static getInstance() {
        return new LoginService(
            IfrcGoAuthRepo.getInstance(), 
            UserRepo.getInstance(),
            SessionUtility.getInstance());
    }

    public async login(loginRequest: LoginRequest): Promise<LoginResponse> {
        let ifrcUser = await this.ifrcGoAuthRepo.verifyLogin(loginRequest);

        if (!ifrcUser) {
            throw new RcdaError(RcdaErrorTypes.ClientError, "The provided authentication credentials are invalid");
        }

        let user = await this.userRepo.getByAccount(ifrcUser.id, RcdaAuthenticationProviders.IfrcGo);
        if (!user) {
            user = await this.userRepo.create({
                ...new UserModel(), 
                id: uuid(),
                accounts: [
                    {
                        id: ifrcUser.id,
                        provider: RcdaAuthenticationProviders.IfrcGo,
                        sessionToken: null
                    }
                ]
            });
        }

        let userSession = this.sessionUtility.getUserSession(user);

        return {
            sessionToken: await this.sessionUtility.getSessionToken(userSession)
        };
    }

    public async verify(sessionToken: string): Promise<UserSession> {
        return this.sessionUtility.parseSessionToken(sessionToken);
    }
}