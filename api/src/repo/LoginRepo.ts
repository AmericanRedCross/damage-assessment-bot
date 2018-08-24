import axios, { AxiosInstance } from "axios";
import { sign, SignOptions, Secret, VerifyOptions, verify } from "jsonwebtoken";
import LoginRequest from "@common/models/login/LoginRequest";
import UserModel from "@common/models/user/UserModel";
import UserSession from "@common/models/user/UserSession";
import RcdaCosmosClient from "@/repo/utils/RcdaCosmosClient";

export default class LoginRepo {
    constructor(
        private cosmosClient: RcdaCosmosClient,
        private axios: AxiosInstance, 
        private jwt: { sign: typeof sign, verify: typeof verify }) {}

    static getInstance() {
        return new LoginRepo(RcdaCosmosClient.getInstance(), axios, { sign, verify });
    }

    public async verifyLogin(loginCredentials: {username: string, password: string}): Promise<boolean> {
        try {
            let result = await this.axios.post<{id: string, expires: string}>("https://dsgocdnapi.azureedge.net/get_auth_token", {
                username: loginCredentials.username,
                password: loginCredentials.password
            });
            return result.status >= 200 && result.status < 300;
        }
        catch {
            return false;
        }
    }

    static jwtSignature = "54376454frwcbyx6c4wgurwj";

    public async getSessionToken(user: UserModel): Promise<string> {
        return this.jwt.sign(user, LoginRepo.jwtSignature);
    }

    public async parseSessionToken(token: string): Promise<UserSession> {
        try {
           let session = <UserSession>this.jwt.verify(token, LoginRepo.jwtSignature);
           return session;
        }
        catch {
            return null;
        }
    }
}