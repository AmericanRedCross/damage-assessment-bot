const glob = require("glob");
const CosmosClient = require("@azure/cosmos").CosmosClient;

const { azureResourceUrl } = require("../utils/resourceHelpers");
const { post } = require("../utils/httpRequests");
const { configValues } = require("../utils/config");

module.exports = async function deployCosmos(armSessionToken, { cosmosEndpoint, cosmosKey }  = {}) {

    console.log("Deploying cosmos collections");

    if (!cosmosEndpoint) {
        cosmosEndpoint = `https://${configValues.cosmosAccountName}.documents.azure.com`;
    }
    if (!cosmosKey) {
        let cosmosKeyResponse = await post(azureResourceUrl("Microsoft.DocumentDB/databaseAccounts", `${configValues.cosmosAccountName}/listKeys`, "2015-04-08"), null, armSessionToken);
        cosmosKey = cosmosKeyResponse.data.primaryMasterKey
    }

    const client = new CosmosClient({
        endpoint: cosmosEndpoint,
        auth: {
            masterKey: cosmosKey
        }
    });

    let cosmosFolderRelativePath = "../definitions/cosmos";

    let dbFiles = glob.sync("*/*.database.json", { cwd: `${__dirname}/${cosmosFolderRelativePath}` });
    for (let dbFile of dbFiles) {
        let dbFolderName = dbFile.slice(0, dbFile.indexOf("/"));
        let db = require(`${cosmosFolderRelativePath}/${dbFile}`);
        // the throughput will only be set on first run. additonal changes must be made in the portal
        // the throughput is set on the database.json config. This is not a natively supported config, so we pull it off then remove it
        let { _offerThroughput } = db;
        delete db._offerThroughput;
        await client.databases.createIfNotExists(db, { offerThroughput: _offerThroughput });

        let collectionFiles = glob.sync(`./${dbFolderName}/collections/*.collection.json`, { cwd: `${__dirname}/${cosmosFolderRelativePath}` });
        for (let collectionFile of collectionFiles) {
            let collection = require(`${cosmosFolderRelativePath}/${collectionFile}`);

            await client.database(db.id).containers.createIfNotExists(collection);
            await client.database(db.id).container(collection.id).replace(collection);
        }
    }
}