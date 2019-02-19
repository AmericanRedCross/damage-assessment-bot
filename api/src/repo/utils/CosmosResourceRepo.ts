import RcdaCosmosClient from "./RcdaCosmosClient";
import { Container, FeedOptions, SqlQuerySpec } from "@azure/cosmos";
import RcdaError, { RcdaErrorTypes } from "@common/system/RcdaError";

export default abstract class CosmosResourceRepo<TResource extends {id: string}> {
    
    constructor(private cosmosClient: RcdaCosmosClient, containerId: string) {
        this.resourceContainer = cosmosClient.rcdaDatabase.container(containerId);
    }

    protected resourceContainer!: Container;
    
    public async create(user: TResource): Promise<TResource> {
        try {
            let response = await this.resourceContainer.items.create<TResource>(user);
            return response.body;
        }
        catch (ex) {
            throw ex;
        }
    }

    public async get(id: string): Promise<TResource> {
        try {
            let result = await this.resourceContainer.item(id).read<TResource>();
            return result.body;
        }
        catch (ex) {
            if (ex.code === 404) {
                return null;
            } 
            throw ex;
        }
    }

    public async update(model: TResource): Promise<TResource> {
        try {
            let response = await this.resourceContainer.item(model.id).replace<TResource>(model);
            return response.body;
        }
        catch (ex) {
            throw ex;
        }
    }

    public async delete(id: string): Promise<void> {
        try {
            let response = await this.resourceContainer.item(id).delete();
            return;
        }
        catch (ex) {
            throw ex;
        }
    }

    protected async query<TResult = TResource>(query: string, parameters?: {[key: string]: string|number|boolean}, options?: FeedOptions): Promise<TResource[]> {

        try {
            let querySpec: SqlQuerySpec = { query, parameters: [] }

            for (const parameterName in parameters) {
                querySpec.parameters.push({
                    name: `@${parameterName}`,
                    value: parameters[parameterName]
                });
            }

            options = {
                enableCrossPartitionQuery: true,
                ...options
            };

            let response = await this.resourceContainer.items.query<TResource>(querySpec, options).toArray();

            return response.result;
        }
        catch (ex) {
            throw ex;
        }
    }

    protected async querySingle<TResult = TResource>(query: string, parameters?: {[key: string]: string|number|boolean}, options?: FeedOptions): Promise<TResource> {

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