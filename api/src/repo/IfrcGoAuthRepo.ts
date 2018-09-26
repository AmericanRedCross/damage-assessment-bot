import axios, { AxiosInstance } from "axios";
import RcdaCosmosClient from "@/repo/utils/RcdaCosmosClient";

export default class IfrcGoAuthRepo {
    constructor(
        private axios: AxiosInstance) {}

    static getInstance() {
        return new IfrcGoAuthRepo(axios);
    }

    public async verifyLogin(loginCredentials: {username: string, password: string}): Promise<{id: string}> {
        try {
            let result = await this.axios.post<{id: string, expires: string}>("https://dsgocdnapi.azureedge.net/get_auth_token", {
                username: loginCredentials.username,
                password: loginCredentials.password
            });
            if (result.status >= 200 && result.status < 300) {
                return {
                    id: result.data.id.toString()
                };
            }
            return null;
        }
        catch {
            return null;
        }
    }
}