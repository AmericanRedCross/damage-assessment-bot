const process = require("process");
const fs = require("fs");
const { get } = require("./httpRequests");
const authenticate = require("./authenticate");

let isTravisDeployment = !!process.env["TRAVIS"];
let configValues = {};

if (!isTravisDeployment) {
    configValues = require("../config/config.values.json");
}

const useKeyVaultForConfig = isTravisDeployment || configValues.useKeyVaultForConfig;

let targetEnvironment = null;
if (isTravisDeployment) {
    targetEnvironment = getDeployValue("TargetEnvironment");
}
configValues.tenantId = getDeployValue("TenantId");
configValues.subscriptionId = getDeployValue("SubscriptionId",targetEnvironment);
configValues.resourceGroupName = getDeployValue("ResourceGroupName", targetEnvironment);
configValues.deploymentRegion = getDeployValue("DeploymentRegion", targetEnvironment);
configValues.keyVaultName = getDeployValue("KeyVaultName", targetEnvironment);
configValues.deployAgentClientId = getDeployValue("DeployAgentClientId");
configValues.deployAgentClientSecret = getDeployValue("DeployAgentClientSecret");

let configKeys = require("../config/config.keys.json");

if (!useKeyVaultForConfig) {
    // validate no config values are null or undefined
    for (let key in configValues) {
        if (!configValues[key] && typeof configValues[key] !== "boolean") {
            throw new Error(`Expected a value for config.values.json setting '${key}', but found '${config[key]}'`)
        }
    }
    // validate all keys in configKeys are on configValues
    for (let key in configKeys) {
        if (!configValues.hasOwnProperty(key)) {
            throw new Error(`The value '${key}' is specified in config.keys.json but is missing from config.values.json.`)
        }
    }
}

async function applyConfigValuesFromKeyVault(configValues) {

    let keyVaultSessionToken = await authenticate("https://vault.azure.net", configValues);

    // verify that all expected config settings are defined in key vault
    let getSecretsResponse = await get(`https://${configValues.keyVaultName}.vault.azure.net/secrets/?api-version=2016-10-01`, keyVaultSessionToken);

    if (!getSecretsResponse.data.value) {
        throw new Error('No secrets were found in the key vault. If this is the first time deploying to this environment, you must add configuration values to the key vault as secrets. See the deploy/README.md for more info.')
    }

    let keyVaultSecrets = getSecretsResponse.data.value.map(s => s.id.split("/").pop());
    let secretsNotInKeyVault = Object.keys(configKeys).filter(k => !keyVaultSecrets.includes(k));
    if (secretsNotInKeyVault.length > 0) {
        throw new Error(`One or more configurations specified in config.keys.json were not found in key vault '${configValues.keyVaultName}': '${secretsNotInKeyVault.join("', '")}'`)
    }

    // get the specified keys and apply to configValues
    for (let key in configKeys) {
        let getSecretValueResponse = await get(`https://${configValues.keyVaultName}.vault.azure.net/secrets/${key}?api-version=2016-10-01`, keyVaultSessionToken);

        configValues[key] = getSecretValueResponse.data.value;
    }
}

function getDeployValue(envVariable, envTarget) {
    let deployValue = null;
    if (isTravisDeployment) {
        if (envTarget) {
            // prefix with environment target
            envVariable = `${envTarget}_${envVariable}`;
        }
        deployValue = getPropertyCaseInsensitively(process.env, envVariable)
        if (!deployValue) {
            throw new Error(`Deployment could not be started. '${envVariable}' environment variable is expected for travis deployments, but was not found`);
        }
    }
    else {
        deployValue = getPropertyCaseInsensitively(configValues, envVariable);
        if (!deployValue) {
            throw new Error(`Deployment could not be started. '${envVariable}' was expected in config.values.json, but was not found`);
        }
    }
    return deployValue;
}

function getPropertyCaseInsensitively(value, key) {
    let keyName = Object.keys(value).find(x => x.toLowerCase() === key.toLowerCase());
    return value[keyName];
}

module.exports = { 
    useKeyVaultForConfig,
    configKeys, 
    configValues,
    applyConfigValuesFromKeyVault
};