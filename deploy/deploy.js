const axios = require("axios");
const querystring = require('querystring');
const process = require("process");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const { config, secrets } = require("./config");

(async function deploy() {
try {

    buildArmDeploymentFiles();

    let armSessionToken = await authenticate("https://management.core.windows.net/");
    let storageSessionToken = await authenticate("https://storage.azure.com/");
    let keyVaultSessionToken = await authenticate("https://vault.azure.net");

    await ensureStorageAndKeyVaultExist(armSessionToken, storageSessionToken);

    await validateKeyVaultSecrets(keyVaultSessionToken);

    await initiateArmDeployment(armSessionToken);


    // await deployAppResources(httpConfig);

    // await swapAppSlots(httpConfig);
}
catch (ex) {
    console.log(ex);
}
})();

async function authenticate(resource) {

    let response = await post(`https://login.microsoftonline.com/${config.tenantId}/oauth2/token?api-version=1.0`, 
        querystring.stringify({
            "grant_type": "client_credentials",
            "client_id": process.env["AzureClientId"],
            "client_secret": process.env["AzureClientSecret"],
            "resource": resource
        }), 
        null, { 
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

    return response.data["access_token"];
}

function buildArmDeploymentFiles() {

    // 1) build the full arm template file
    let armTemplate = require("./arm-template.partial.json");

    // remove the explanatory note within the template
    delete armTemplate.parameters.$secrets;

    // add parameter entry for each secret
    for (const key in secrets) {
        armTemplate.parameters[key] = {
            "type": "securestring"
        }
    }

    // set app settings 
    let webApp = armTemplate.resources.find(r => r.type.toLowerCase() === "microsoft.web/sites")
    
    // remove explanatory note about app settings, overwrite with array
    let appSettings = webApp.properties.siteConfig.appSettings = [];

    // add app setting as inline value for non-secret config values
    for (const key in config) {
        appSettings.push({
            "name": key,
            "value": config[key]
        });
    }

    // add app setting as parameter for secrets
    for (const key in secrets) {
        appSettings.push({
            "name": key,
            "value": `[parameters('${key}')]`
        });
    }

    // 2) build the full arm parameters file
    let armParameters = require("./arm-parameters.partial.json");
    
    // overwrite example parameters in template
    armParameters.parameters = {};

    // add non-secret config values as standard parameters
    for (const key in config) {
        armParameters.parameters[key] = {
            "value": config[key]
        };
    }

    // add secret parameters via key vault reference
    const keyVaultId = `/subscriptions/${config.subscriptionId}/resourceGroups/${config.resourceGroupName}/providers/Microsoft.KeyVault/vaults/${config.keyVaultName}`
    for (const key in secrets) {
        armParameters.parameters[key] = {
            "reference": {
                "secretName": secrets[key],
                "keyVault": {
                    "id": keyVaultId
                }
            }
        }
    }

    // 3) save built templates to dist folder
    let dist = `${__dirname}/dist`
    if (!fs.existsSync(dist)) {
        fs.mkdirSync(dist);
    }
    fs.writeFileSync(`${dist}/template.json`, JSON.stringify(armTemplate, null, 4))
    fs.writeFileSync(`${dist}/parameters.json`, JSON.stringify(armParameters, null, 4))
}

function createKeyVaultIfNotExists(armSessionToken) {
    
    // Check if key vault exists, create it if not
    const keyVaultUrl = azureResourceUrl("Microsoft.KeyVault/vaults", config.keyVaultName, "2016-10-01");
    let getKeyVaultResponse = await get(keyVaultUrl, armSessionToken);
    
    let clientSecurityPrincipalId = jwt.decode(armSessionToken).oid;
    
    if (getKeyVaultResponse.status === 404) {
        //TODO extract from arm template
        await put(keyVaultUrl, {
            "kind": "StorageV2",
            "location": config.location,
            "properties": {
                "sku": {
                    "family": "A",
                    "name": "Standard"
                },
                "tenantId": config.tenantId,
                "accessPolicies": [
                    {
                        "tenantId": config.tenantId,
                        "objectId": clientSecurityPrincipalId,
                        "permissions": {
                            "secrets": [
                                "Get",
                                "List"
                            ]
                        }
                    }
                ],
                "enabledForTemplateDeployment": true
            }
        }, armSessionToken);
    }
}

async function ensureStorageAndKeyVaultExist(armSessionToken, storageSessionToken) {

    // Check if storage account exists, create it if not
    const storageAccountUrl = azureResourceUrl("Microsoft.Storage/storageAccounts", config.storageAccountName, "2018-02-01");
    let getStorageResponse = await get(storageAccountUrl, armSessionToken);

    if (getStorageResponse.status === 404) {
        //TODO extract from arm template
        await put(storageAccountUrl, {
            "sku": {
                "name": "Standard_RAGRS",
                "tier": "Standard"
            },
            "kind": "StorageV2",
            "type": "Microsoft.Storage/storageAccounts",
            "location": config.location,
            "properties": {
                "supportsHttpsTrafficOnly": true,
                "encryption": {
                    "services": {
                        "file": {
                            "enabled": true,
                            "lastEnabledTime": "2018-10-07T00:43:29.1745736Z"
                        },
                        "blob": {
                            "enabled": true,
                            "lastEnabledTime": "2018-10-07T00:43:29.1745736Z"
                        }
                    },
                    "keySource": "Microsoft.Storage"
                },
                "accessTier": "Hot"
            }
        }, armSessionToken);
    }
    
    // Check if storage deployment files container exists, create it if not
    const deploymentFilesContainerUrl = `https://${config.storageAccountName}.blob.core.windows.net/deploy?restype=container`
    let deploymentFilesContainerRequestHeaders = { "x-ms-version": "2018-03-28" };
    let getDeploymentFilesContainerResponse = await get(deploymentFilesContainerUrl, storageSessionToken, { headers: deploymentFilesContainerRequestHeaders });

    if (getDeploymentFilesContainerResponse.status === 404) {
        await put(deploymentFilesContainerUrl, null, storageSessionToken, {
            headers: deploymentFilesContainerRequestHeaders
        });
    }
}

async function putDeploymentTemplatesInStorage(storageSessionToken) {

    let headers = {
        "x-ms-version": "2018-03-28",
        "x-ms-date": new Date().toUTCString(),
        "x-ms-blob-type": "BlockBlob"
    };

    await put(`https://${config.storageAccountName}.blob.core.windows.net/deploy/template.json`,
        fs.readFileSync(`${__dirname}/dist/template.json`),
        storageSessionToken, {
            headers
        });

    await put(`https://${config.storageAccountName}.blob.core.windows.net/deploy/parameters.json`,
        fs.readFileSync(`${__dirname}/dist/parameters.json`),
        storageSessionToken, {
            headers
        });
}

async function initiateArmDeployment(armSessionToken) {
    await put(azureResourceUrl("Microsoft.Resources/deployments", `rcda-deploy-${new Date().getTime()}`, "2015-01-01"),
        {
            "properties": {
              "mode": "Incremental",
              "template": JSON.parse(fs.readFileSync(`${__dirname}/dist/template.json`)),
              "parameters": JSON.parse(fs.readFileSync(`${__dirname}/dist/parameters.json`)).parameters,
            }
        },
        armSessionToken);
}

async function validateKeyVaultSecrets(keyVaultToken) {

    let getSecretsResponse = await get(`https://${config.keyVaultName}.vault.azure.net/secrets/?api-version=2016-10-01`, keyVaultToken);

    let keyVaultSecrets = getSecretsResponse.data.value.map(s => s.id.slice(s.id.lastIndexOf("/") + 1));
    let configuredSecrets = Object.keys(secrets).map(s => secrets[s]);

    let secretsNotInKeyVault = configuredSecrets.filter(s => !keyVaultSecrets.includes(s));

    if (secretsNotInKeyVault.length > 0) {
        throw new Error(`One or more secrets specified in config.$secrets were not found in key vault '${config.keyVaultName}': '${secretsNotInKeyVault.join("', '")}'`)
    }
}

function azureResource(type, id) {
    return `subscriptions/${config.subscriptionId}/resourceGroups/${config.resourceGroupName}/providers/${type}/${id}`
}

function azureResourceUrl(type, id, apiVersion) {
    return `https://management.azure.com/${azureResource(type, id)}?api-version=${apiVersion}`
}

async function http(method, url, data, authToken, config, ignoreNotFound=false) {
    try {
        config = config || {};
        config.headers = config.headers || {};
        if (authToken) {
            config.headers["Authorization"] = `Bearer ${authToken}`;
        }
        if (data && !config.headers["Content-Type"]) {
            config.headers["Content-Type"] = "application/json";
        }
        let response = await axios({ method, url, data, ...config });
        return response;
    }
    catch (error) {
        let response = error.response;
        if (ignoreNotFound && response && response.status === 404) {
            return response;
        }
        throw error;
    }
}

function get(url, authToken, config) { return http("get", url, null, authToken, config, true) }
function post(url, data, authToken, config) { return http("post", url, data, authToken, config) }
function put(url, data, authToken, config) { return http("put", url, data, authToken, config) }

async function asyncTimeout(seconds) {
    await new Promise(resolve => setTimeout(resolve, seconds * 1000));
}