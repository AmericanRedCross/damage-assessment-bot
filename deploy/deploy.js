const fs = require("fs");
const AdmZip = require("adm-zip");
const glob = require("glob");
const process = require("process");
const jwt = require("jsonwebtoken");

const { get, post, put } = require("./utils/httpRequests");
const { config, secrets } = require("./utils/config");
const authenticate = require("./utils/authenticate");
const deployArmTemplate = require("./utils/deployArmTemplate");
const { azureResourceUrl } = require("./utils/resourceHelpers");
const deployCosmos = require("./utils/deployCosmos");
const asyncTimeout = require("./utils/asyncTimeout");

(async function deploy() {
    try {
        console.log(`Beginning deployment to ${process.env["DeployEnvironment"]}`)

        let armSessionToken = await authenticate("https://management.core.windows.net/");
        let storageSessionToken = await authenticate("https://storage.azure.com/");

        // Infrastructure
        // await deployArmTemplate("keyVault", armSessionToken, { securityPrincipalId: jwt.decode(armSessionToken).oid });

        await deployArmTemplate("main", armSessionToken);

        // await deployStorageQueues(storageSessionToken);

        // await deployCosmos(armSessionToken);

        // // App
        // await deployAzureFunctions(armSessionToken);

        // await deployFrontendResources(storageSessionToken);

        console.log(`Deployment finished successfully ${new Date().toUTCString()}`);
    }
    catch (ex) {
        console.log(ex);
        if (ex.response) {
            console.log(ex.response.data.error.message);
        }
    }
})();

async function deployStorageQueues(storageSessionToken) {

    console.log("Deploying azures storage queues");

    let storageHttpConfig = {
        headers: {
            "x-ms-version": "2018-03-28",
            "x-ms-date": new Date().toUTCString()
        }
    }

    for (let queue of require("./definitions/storage/queues.config.json")) {
        let timeout = queue.timeout ? `&timeout=${queue.timeout}` : "";
        await put(`https://${config.storageAccountName}.queue.core.windows.net/${queue.name}${timeout}`, null, storageSessionToken, storageHttpConfig);
    }
}

async function deployAzureFunctions(armSessionToken) {

    console.log("Deploying azure functions");
    
    // deploy app settings to the deployment slot
    let cosmosKeyResponse = await post(azureResourceUrl("Microsoft.DocumentDB/databaseAccounts", `${config.cosmosAccountName}/listKeys`, "2015-04-08"), null, armSessionToken);
    await deployArmTemplate("appsettings", armSessionToken, { cosmosMasterKey: cosmosKeyResponse.data.primaryMasterKey });

    // get publish profile credentials
    let publishProfilesResult = await post(azureResourceUrl("Microsoft.Web/sites", `${config.functionAppName}/slots/swap/config/publishingcredentials/list`, "2016-08-01"), null, armSessionToken);

    let { publishingUserName, publishingPassword } = publishProfilesResult.data.properties;

    var zip = new AdmZip();
    zip.addLocalFolder(`${__dirname}/../api/dist`);

    // zip deployment of api resources to the deployment slot
    await post(`https://${config.functionAppName}-swap.scm.azurewebsites.net/api/zipdeploy`, zip.toBuffer(), null, {
        auth: {
            username: publishingUserName,
            password: publishingPassword
        }
    })

    //TODO activate setting for disabled functions, possibly reset the instances

    // swap the slots, make the deployment slot the new live slot
    let swapResponse = await post(azureResourceUrl("Microsoft.Web/sites", `${config.functionAppName}/slotsswap`, "2016-08-01"), { "targetSlot": "swap" }, armSessionToken)

    // wait for swap to complete
    while (true) {
        let verifySwapResponse = await get(swapResponse.headers.location, armSessionToken);
        if (verifySwapResponse.status === 202) {
            // still running, wait a bit and try again
            await asyncTimeout(5000);
            continue;
        }
        if (verifySwapResponse.status === 200) {
            // done
            break;
        }
        // unsupported scenario
        throw new Error(`Unexpected response ${verifySwapResponse.status} returned while verifying swap of server slots`);
    }

    //TODO disable the deployment slot
}

async function deployFrontendResources(storageSessionToken) {

    console.log("Deploying frontend app resources");

    let blobStorageHttpConfig = {
        headers: {
            "x-ms-version": "2018-03-28",
            "x-ms-date": new Date().toUTCString(),
            "x-ms-blob-type": "BlockBlob"
        }
    }

    // set properties (enables static website hosting)
    let blobServicePropertiesXml = fs.readFileSync(`${__dirname}/definitions/storage/blobService.properties.xml`)

    await put(`https://${config.storageAccountName}.blob.core.windows.net/?restype=service&comp=properties`,
        blobServicePropertiesXml,
        storageSessionToken,
        blobStorageHttpConfig);

    let frontentFiles = glob.sync("**", { cwd: `${__dirname}/../web/dist` });
    for (let fileName of frontentFiles) {
        await put(`https://${config.storageAccountName}.blob.core.windows.net/$web/dist/${fileName}`,
            fs.readFileSync(`${__dirname}/../web/dist/${fileName}`),
            storageSessionToken,
            blobStorageHttpConfig);
    }

    //deploy index.html (TODO: put index.html in dist folder as part of web build)
    await put(`https://${config.storageAccountName}.blob.core.windows.net/$web/index.html`,
        fs.readFileSync(`${__dirname}/../web/index.html`),
        storageSessionToken,
        { headers: { ...blobStorageHttpConfig.headers, "Content-Type": "text/html" } });
}