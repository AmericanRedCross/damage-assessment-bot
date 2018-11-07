import RcdaCosmosClient from "@/repo/utils/RcdaCosmosClient";
import ChatRegistrationModel from "@common/models/resources/ChatRegistrationModel";
import CosmosResourceRepo from "@/repo/utils/CosmosResourceRepo";

//TODO configure collection with 5 minute TTL
export default class ChatRegistrationRepo extends CosmosResourceRepo<ChatRegistrationModel> {

    constructor(cosmosClient: RcdaCosmosClient) {
        super(cosmosClient, "ChatRegistrations");
    }

    static getInstance(): ChatRegistrationRepo {
        return new ChatRegistrationRepo(RcdaCosmosClient.getInstance());
    }
}