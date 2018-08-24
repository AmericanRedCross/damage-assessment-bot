import { IAddress } from "botbuilder";
import RcdaCosmosClient from "@/repo/utils/RcdaCosmosClient";


export default class ChatRegistrationRepo {

    constructor(private cosmosClient: RcdaCosmosClient) {}

    public static getInstance(): ChatRegistrationRepo {
        return new ChatRegistrationRepo(RcdaCosmosClient.getInstance());
    }

    public async setupRegistrationToken(address: IAddress): Promise<string> {
        let registrationToken = this.getRegistrationToken();
        await this.cosmosClient.chatAddresses.items.upsert({ id: registrationToken, address });
        return registrationToken;
    }

    public async verifyRegistrationToken(registrationToken: string): Promise<IAddress> {
        let result = await this.cosmosClient.chatAddresses.item(registrationToken.toUpperCase()).read();
        if (!result) {
            return null;
        }
        return result.body.address;
    }

    private getRegistrationToken() {
        //TODO: validate if this is acceptable for multi-language app
        let charSet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let token = "";
        for (var i = 1; i <= 6; i++) {
            token += charSet[Math.floor(Math.random() * charSet.length)]
        }
        return token;
    }
}