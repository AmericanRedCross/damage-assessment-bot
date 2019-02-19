import { CosmosClient, ConnectionPolicy } from "@azure/cosmos";

export interface RcdaCosmosClientOptions {
    cosmosDbHost: string;
    cosmosDbKey: string;
};

export default class RcdaCosmosClient extends CosmosClient {
    
    public static getInstance(): RcdaCosmosClient {
        return new RcdaCosmosClient({
            cosmosDbHost: process.env["CosmosDbHost"],
            cosmosDbKey: process.env["CosmosDbKey"]
        });
    }

    constructor(options: RcdaCosmosClientOptions) {
        super({ 
            endpoint: options.cosmosDbHost, 
            auth: { 
                masterKey: options.cosmosDbKey 
            },
            connectionPolicy: { 
                ...new ConnectionPolicy(),
                RequestTimeout: 15000
            }
        });
    }

    public get rcdaDatabase() {
        return this.database("Rcda");
    }

    public get rcdaCoreCollection() {
        return this.rcdaDatabase.container("Core");
    }
}