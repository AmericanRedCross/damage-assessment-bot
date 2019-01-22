const fs = require("fs");
const AdmZip = require("adm-zip");
const glob = require("glob");
const process = require("process");
const jwt = require("jsonwebtoken");

const { get, post, put } = require("./utils/httpRequests");
const { configValues, useKeyVaultForConfig, applyConfigValuesFromKeyVault } = require("./utils/config");
const authenticate = require("./utils/authenticate");
const deployArmTemplate = require("./utils/deployArmTemplate");
const { azureResourceUrl } = require("./utils/resourceHelpers");
const deployCosmos = require("./utils/deployCosmos");
const asyncTimeout = require("./utils/asyncTimeout");

(async function deploy() {
    try {
        console.log(`Beginning deployment for ${(process.env["TargetEnvironment"] || "custom")} environment`)

        let armSessionToken = await authenticate("https://management.core.windows.net/", configValues);
        let storageSessionToken = await authenticate("https://storage.azure.com/", configValues);

        // Infrastructure
        let accessPoliciesToPreserve = await getActiveKeyVaultAccessPolicies(armSessionToken);
        
        await deployArmTemplate("keyVault", armSessionToken, { 
            securityPrincipalId: jwt.decode(armSessionToken).oid,
            additionalAccessPolicies: accessPoliciesToPreserve
        });
        
        if (useKeyVaultForConfig) {
            await applyConfigValuesFromKeyVault(configValues);
        }

        await deployArmTemplate("main", armSessionToken);

        await deployStorageQueues(storageSessionToken);
        await deployStorageAccountSettings(storageSessionToken)

        await deployCosmos(armSessionToken);

        // App
        await deployAzureFunctions(armSessionToken);

        await deployFrontendResources(storageSessionToken);

        console.log(`Deployment finished successfully ${new Date().toUTCString()}`);
    }
    catch (ex) {
        if (ex.response && ex.response.data.error) {
            console.log(ex.response.data.error.message);
        }
        throw ex;
    }
})();

async function getActiveKeyVaultAccessPolicies(armSessionToken) {
    
    try {
        let getKeyVaultResponse = await get(azureResourceUrl("Microsoft.KeyVault/vaults", configValues.keyVaultName, "2018-02-14"), armSessionToken);

        // if 404, this is probably a first time deployment and the key vault does not exist yet
        if (getKeyVaultResponse.status === 404) {
            return [];
        }
        
        return getKeyVaultResponse.data.properties.accessPolicies;
    } 
    catch (error) {
        if (error.response && error.response.status === 403) {
            return [];
        }
        throw error;
    }
}

async function deployStorageQueues(storageSessionToken) {

    console.log("Deploying azure storage queues");

    let storageHttpConfig = {
        headers: {
            "x-ms-version": "2018-03-28",
            "x-ms-date": new Date().toUTCString()
        }
    }

    for (let queue of require("./definitions/storage/queues.config.json")) {
        console.log(`Deploying '${queue.name}' queue`);

        let timeout = queue.timeout ? `&timeout=${queue.timeout}` : "";
        await put(`https://${configValues.storageAccountName}.queue.core.windows.net/${queue.name}${timeout}`, null, storageSessionToken, storageHttpConfig);
    }
}

async function deployStorageAccountSettings(storageSessionToken) {

    console.log("Configuring storage account for static site hosting");

    let blobStorageHttpConfig = {
        headers: {
            "x-ms-version": "2018-03-28",
            "x-ms-date": new Date().toUTCString(),
            "x-ms-blob-type": "BlockBlob"
        }
    }

    // set properties (enables static website hosting)
    let blobServicePropertiesXml = fs.readFileSync(`${__dirname}/definitions/storage/blobService.properties.xml`)

    await put(`https://${configValues.storageAccountName}.blob.core.windows.net/?restype=service&comp=properties`,
        blobServicePropertiesXml,
        storageSessionToken,
        blobStorageHttpConfig);
}

async function deployAzureFunctions(armSessionToken) {

    console.log("Deploying azure functions");

    let botServiceKeyResult = await get(azureResourceUrl("Microsoft.BotService/botServices", `${configValues.functionAppName}/channels/DirectLineChannel/listkeys`, "2018-07-12"), armSessionToken);
    let storageAccount = await get(azureResourceUrl("Microsoft.Storage/storageAccounts", configValues.storageAccountName, "2018-07-01"), armSessionToken);
    
    // deploy app settings to the deployment slot
    await deployArmTemplate("appsettings", armSessionToken, {
        "botServiceDirectLineSecret": botServiceKeyResult.data.properties.properties.sites[0].key,
        // until DNS is set up for the site, this gets set to the storage account's public url
        "webAppUrl": storageAccount.data.properties.primaryEndpoints.web
    });

    // get publish profile credentials
    let publishProfilesResult = await post(azureResourceUrl("Microsoft.Web/sites", `${configValues.functionAppName}/slots/swap/config/publishingcredentials/list`, "2016-08-01"), null, armSessionToken);

    let { publishingUserName, publishingPassword } = publishProfilesResult.data.properties;

    console.log("Initiating .zip deployment to app service");

    var zip = new AdmZip();
    zip.addLocalFolder(`${__dirname}/../api/dist`);

    // zip deployment of api resources to the deployment slot
    await post(`https://${configValues.functionAppName}-swap.scm.azurewebsites.net/api/zipdeploy`, zip.toBuffer(), null, {
        headers: {
            "Content-Type": "application/octet-stream"
        },
        auth: {
            username: publishingUserName,
            password: publishingPassword
        }
    });
    
    console.log("Pinging api's health check endpoint in the deployment slot.")

    let apiHealthResponse = await get(`https://${configValues.functionAppName}-swap.azurewebsites.net/api/v1/health`);

    if (apiHealthResponse.status !== 200) {
        throw new Error(`Api health check of deployment slot failed. GET /api/v1/health returned status ${apiHealthResponse.status}. Swap to live slot did not occur.`);
    }

    console.log("Health check succeeded.");

    console.log("Initiating swap to the live slot.");

    // swap the slots, make the deployment slot the new live slot
    let swapResponse = await post(azureResourceUrl("Microsoft.Web/sites", `${configValues.functionAppName}/slots/swap/slotsswap`, "2016-08-01"), { "targetSlot": "production" }, armSessionToken)

    // wait for swap to complete
    while (true) {
        let verifySwapResponse = await get(swapResponse.headers.location, armSessionToken);
        if (verifySwapResponse.status === 202) {
            // still running, wait a bit and try again
            await asyncTimeout(5000);
            continue;
        }
        if (verifySwapResponse.status === 200) {
            console.log("Deployment of azure functions finished.");
            break;
        }
        // unsupported scenario
        throw new Error(`Unexpected response ${verifySwapResponse.status} returned while verifying swap of server slots`);
    }

    //TODO disable the deployment slot
}

async function deployFrontendResources(storageSessionToken) {

    console.log("Deploying frontend app resources");

    let frontentFiles = glob.sync("**", { cwd: `${__dirname}/../web/dist`, nodir: true });
    for (let fileName of frontentFiles) {
        let requestConfig = {
            headers: {
                "x-ms-version": "2018-03-28",
                "x-ms-date": new Date().toUTCString(),
                "x-ms-blob-type": "BlockBlob"
            }
        }

        if (fileName.endsWith(".gz")) {
            requestConfig.headers["x-ms-blob-content-encoding"] = "gzip";
        }

        await put(`https://${configValues.storageAccountName}.blob.core.windows.net/$web/dist/${fileName}`,
            fs.readFileSync(`${__dirname}/../web/dist/${fileName}`),
            storageSessionToken,
            requestConfig);
    }

    //deploy index.html (TODO: put index.html in dist folder as part of web build?)
    await put(`https://${configValues.storageAccountName}.blob.core.windows.net/$web/index.html`,
        fs.readFileSync(`${__dirname}/../web/index.html`),
        storageSessionToken,
        { 
            headers: {
                "x-ms-version": "2018-03-28",
                "x-ms-date": new Date().toUTCString(),
                "x-ms-blob-type": "BlockBlob", 
                "Content-Type": "text/html" 
            } 
        });
}