import { CosmosClient, Container, Database } from "@azure/cosmos";

export default class RcdaCosmosClient extends CosmosClient {
    
    private static endpoint = process.env.HOST || "https://localhost:8081/";
    private static primaryKey = process.env.AUTH_KEY || "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==";

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
        return this.database("Rcda");
    }
}