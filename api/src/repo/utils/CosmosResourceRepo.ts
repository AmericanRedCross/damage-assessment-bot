import RcdaCosmosClient from "./RcdaCosmosClient";
import { Container, FeedOptions, SqlQuerySpec } from "@azure/cosmos";
import RcdaError, { RcdaErrorTypes } from "@common/system/RcdaError";

export default abstract class CosmosResourceRepo<TResource extends {id: string}> {
    
    constructor(private cosmosClient: RcdaCosmosClient, containerId: string) {
        this.resourceContainer = cosmosClient.rcdaDatabase.container(containerId);
    }

    protected resourceContainer!: Container;
    
    async create(user: TResource): Promise<TResource> {
        try {
            let response = await this.resourceContainer.items.create<TResource>(user);
            return response.body;
        }
        catch (ex) {
            throw ex;
        }
    }

    async get(id: string): Promise<TResource> {
        try {
            let result = await this.resourceContainer.item(id).read<TResource>();
            return result.body;
        }
        catch (ex) {
            return null;
        }
    }

    async update(model: TResource): Promise<TResource> {
        try {
            let response = await this.resourceContainer.item(model.id).replace<TResource>(model);
            return response.body;
        }
        catch (ex) {
            throw ex;
        }
    }

    async delete(id: string): Promise<void> {
        try {
            let response = await this.resourceContainer.item(id).delete();
            return;
        }
        catch (ex) {
            throw ex;
        }
    }

    async query<TResult = TResource>(query: string, parameters?: {[key: string]: string|number|boolean}, options?: FeedOptions): Promise<TResource[]> {

        let querySpec: SqlQuerySpec = { query, parameters: [] }

        for (const parameterName in parameters) {
            querySpec.parameters.push({
                name: `@${parameterName}`,
                value: parameters[parameterName]
            });
        }

        let response = await this.resourceContainer.items.query<TResource>(querySpec, options).toArray();

        return response.result;
    }

    async querySingle<TResult = TResource>(query: string, parameters?: {[key: string]: string|number|boolean}, options?: FeedOptions): Promise<TResource> {

        let results = await this.query(query, parameters, options);
        
        if (results.length === 0) {
            return null;
        }
        if (results.length === 1) {
            return results[0];
        }
        throw new RcdaError(RcdaErrorTypes.SystemError, "More than one resource was found, but one or zero was expected.");
    }
}