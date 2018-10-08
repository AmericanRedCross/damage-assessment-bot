const process = require("process");

if (process.env["DeployEnvironment"] && process.env["DeployEnvironment"].toLowerCase() === "prod") {
    throw new Error("This operation is not allowed in production");
}

const { get, put } = require("./utils/httpRequests");
const asyncTimeout = require("./utils/asyncTimeout");
const { azureResourceUrl } = require("./utils/resourceHelpers");
const authenticate = require("./utils/authenticate");

(async function resetEnvironment() {
    try {
        let armSessionToken = await authenticate("https://management.core.windows.net/");

        let template = {
            "$schema": "http://schema.management.azure.com/schemas/2018-05-01/deploymentTemplate.json#",
            "contentVersion": "1.0.0.0",
            "parameters": {},
            "resources": []
        };
        let parameters = {};

        let deploymentId = `rcda-deploy-reset-${new Date().getTime()}`;
        let deploymentUrl = azureResourceUrl("Microsoft.Resources/deployments", deploymentId, "2018-01-01");

        await put(deploymentUrl,
            {
                "properties": {
                    "mode": "Complete",
                    template,
                    parameters
                }
            },
            armSessionToken);

        let timeoutInMinutes = 20;
        console.log(`Waiting for resource group reset deployment to finish. Script will timeout if deployment exceeds ${timeoutInMinutes} minutes.`)

        let deploymentStartTime = Date.now();
        while (true) {
            await asyncTimeout(30000);

            let getDeploymentStatus = await get(deploymentUrl, armSessionToken);
            if (getDeploymentStatus.data.properties.provisioningState === "Succeeded") {
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
    catch (ex) {
        console.log(ex);
    }
})();