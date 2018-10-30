const fs = require("fs");

const { get, put } = require("./httpRequests");
const { configValues, configKeys } = require("./config");
const asyncTimeout = require("./asyncTimeout");
const { azureResourceUrl, azureResource } = require("./resourceHelpers");

module.exports = async function deployArmTemplate(templateId, armSessionToken, extraParameterValues = {}) {

    console.log(`Beginning deployment of ${templateId}.template.json`);

    let template = JSON.parse(fs.readFileSync(`${__dirname}/../definitions/${templateId}.template.json`));
    let parameters = getTemplateParameters(templateId, template, extraParameterValues);

    let deploymentId = `rcda-deploy-${templateId}-${new Date().getTime()}`;
    let deploymentUrl = azureResourceUrl("Microsoft.Resources/deployments", deploymentId, "2018-01-01");

    await put(deploymentUrl,
        {
            "properties": {
              "mode": "Incremental",
              "template": template,
              "parameters": parameters,
            }
        },
        armSessionToken);

    let timeoutInMinutes = 10; 
    console.log(`Waiting for ${templateId} template deployment to finish. Script will timeout if deployment exceeds ${timeoutInMinutes} minutes.`)

    let deploymentStartTime = Date.now();
    while (true) {
        await asyncTimeout(15000);

        let getDeploymentStatus = await get(deploymentUrl, armSessionToken);
        if (getDeploymentStatus.data.properties.provisioningState === "Succeeded") {
            console.log(`${templateId} template deployment finished`)
            return
        }
        if (getDeploymentStatus.data.properties.provisioningState === "Failed") {
            if (getDeploymentStatus.data.properties.error) {
                console.log(getDeploymentStatus.data.properties.error);
            }
            throw new Error(`Deployment for ${templateId} template failed. Deployment id: ${deploymentId}`);
        }
        let minutesElapsed = (Date.now() - deploymentStartTime) / (60 * 1000)
        if (minutesElapsed > timeoutInMinutes) {
            throw new Error(`Deployment has exceeded ${timeoutInMinutes} minute timeout. Deployment id: ${deploymentId}`);
        }

        console.log(`${minutesElapsed.toFixed(2)} minutes elapsed...`)
    }
}

function getTemplateParameters(templateId, template, extraParameterValues = {}) {
    let parameters = {};

    for (let paramName in template.parameters) {
        let paramDef = template.parameters[paramName];

        if (paramDef.type.toLowerCase() === "securestring" && configKeys.hasOwnProperty(paramName) && !configValues.hasOwnProperty(paramName)) {
            parameters[paramName] = {
                "reference": {
                    "secretName": secrets[paramName],
                    "keyVault": {
                        "id": azureResource("Microsoft.KeyVault/vaults", configValues.keyVaultName)
                    }
                }
            };
            continue;
        }
        if (configValues.hasOwnProperty(paramName) || extraParameterValues.hasOwnProperty(paramName)) {
            parameters[paramName] = {
                "value": configValues[paramName] || extraParameterValues[paramName]
            };
            continue;
        }
        //TODO fix this
        if (!paramDef.hasOwnProperty("defaultValue")) {
            throw new Error(`A required parameter of '${templateId}.template.json' was not specified in config.keys.json: '${paramName}'`);
        }
    }

    return parameters;
}