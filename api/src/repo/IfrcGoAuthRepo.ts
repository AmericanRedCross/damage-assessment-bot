import axios, { AxiosInstance, AxiosError } from "axios";

export interface IfrcGoAuthRepoOptions {
    ifrcGoHost: string
}

export default class IfrcGoAuthRepo {
    constructor(private axios: AxiosInstance, private options: IfrcGoAuthRepoOptions) {}

    static getInstance() {
        return new IfrcGoAuthRepo(axios, { ifrcGoHost: process.env["IfrcGoHost"] });
    }

    public async getUserByLogin(loginCredentials: {username: string, password: string}): Promise<{id: string}> {
        try {
            let result = await this.axios.post<{id: string, expires: string}>(`${this.options.ifrcGoHost}/get_auth_token`, {
                username: loginCredentials.username,
                password: loginCredentials.password
            }, { 
                validateStatus: status => status === 200
            });
            return {
                id: result.data.id.toString()
            };
        }
        catch (error) {
            let axiosError: AxiosError = error;
            if (axiosError.response && axiosError.response.status === 400) {
                return null;
            }
            throw error;
        }
    }
}