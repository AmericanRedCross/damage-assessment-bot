import RcdaCosmosClient from "@/repo/utils/RcdaCosmosClient";
import UserModel, { UserChatAddressModel, UserCountryMembershipModel, UserAccountModel } from "@common/models/resources/UserModel";
import RcdaCountries from "@common/system/RcdaCountries";
import RcdaAuthenticationProviders from "@common/system/RcdaAuthenticationProviders";
import modelProp from "@/repo/utils/modelProp";
import CosmosResourceRepo from "@/repo/utils/CosmosResourceRepo";

export default class UserRepo extends CosmosResourceRepo<UserModel> {

    constructor(cosmosClient: RcdaCosmosClient) {
        super(cosmosClient, "Users");
    }

    public static getInstance(): UserRepo {
        return new UserRepo(RcdaCosmosClient.getInstance());
    }

    async getByAccount(accountId: string, provider: RcdaAuthenticationProviders): Promise<UserModel> {
        return await this.querySingle(`
            SELECT * 
            FROM ROOT c 
            WHERE ARRAY_CONTAINS(c.${modelProp<UserModel>("accounts")}, { 
                ${modelProp<UserAccountModel>("id")}: @accountId,
                ${modelProp<UserAccountModel>("provider")}: @provider
            }, true)
        `, {
            accountId: accountId, 
            provider: provider
        });
    }

    async getByChatAddress(chatAddressId: string): Promise<UserModel> {
        return await this.querySingle(`
            SELECT * 
            FROM ROOT c 
            WHERE ARRAY_CONTAINS(c.${modelProp<UserModel>("chatAddresses")}, { 
                ${modelProp<UserChatAddressModel>("id")}: @chatAddressId
            }, true)
        `, {
            chatAddressId: chatAddressId
        });
    }

    // country gets set on disaster assesment report submission
    //TODO: set up index for country
    async getAllByCountry(country: RcdaCountries): Promise<UserModel[]> {
        return this.query(`
            SELECT * FROM ROOT c 
            WHERE ARRAY_CONTAINS(c.${modelProp<UserModel>("countries")}, { 
                ${modelProp<UserCountryMembershipModel>("id")}: @country 
            }, true)
        `, {
            country:country 
        });
    }
}