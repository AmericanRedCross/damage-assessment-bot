const glob = require("glob");
const CosmosClient = require("@azure/cosmos").CosmosClient;

const { azureResourceUrl } = require("../utils/resourceHelpers");
const { post } = require("../utils/httpRequests");
const { configValues } = require("../utils/config");

module.exports = async function deployCosmos(armSessionToken) {

    console.log("Deploying cosmos collections")

    let cosmosKeyResponse = await post(azureResourceUrl("Microsoft.DocumentDB/databaseAccounts", `${configValues.cosmosAccountName}/listKeys`, "2015-04-08"), null, armSessionToken);

    const client = new CosmosClient({
        endpoint: `https://${configValues.cosmosAccountName}.documents.azure.com`,
        auth: {
            masterKey: cosmosKeyResponse.data.primaryMasterKey
        }
    });

    let cosmosFolderRelativePath = "../definitions/cosmos";

    let dbFiles = glob.sync("*/*.database.json", { cwd: `${__dirname}/${cosmosFolderRelativePath}` });
    for (let dbFile of dbFiles) {
        let dbFolderName = dbFile.slice(0, dbFile.indexOf("/"));
        let db = require(`${cosmosFolderRelativePath}/${dbFile}`);
        await client.databases.createIfNotExists(db);

        let collectionFiles = glob.sync(`./${dbFolderName}/collections/*.collection.json`, { cwd: `${__dirname}/${cosmosFolderRelativePath}` });
        for (let collectionFile of collectionFiles) {
            let collection = require(`${cosmosFolderRelativePath}/${collectionFile}`);

            await client.database(db.id).containers.createIfNotExists(collection);
            await client.database(db.id).container(collection.id).replace(collection, {
                // TODO: this isn't working, need to query these out and update them individually
               // offerThroughput: configValues.cosmosReadUnitsPerCollection[`${db.id}.${collection.id}`] || configValues.cosmosReadUnitsDefault
            });
        }
    }
}