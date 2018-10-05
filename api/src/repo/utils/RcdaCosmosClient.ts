import { CosmosClient, Container, Database } from "@azure/cosmos";

export default class RcdaCosmosClient extends CosmosClient {
    
    private static endpoint = process.env.CosmosDbHost || "https://localhost:8081/";
    private static primaryKey = process.env.CosmosDbKey || "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==";

    constructor() {
        super({ 
            endpoint: RcdaCosmosClient.endpoint, 
            auth: { 
                masterKey: RcdaCosmosClient.primaryKey 
            } 
        });
    }

    public static getInstance(): RcdaCosmosClient {
        return new RcdaCosmosClient();
    }

    public get rcdaDatabase() {
        return this.database("damage-assessment-bot");
    }
}