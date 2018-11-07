# What's in a deployment
This deployment script manages the creation of all

# differences between a custom deploy and a travis deploy
config.dev.json, config.stage.json, and config.prod.json are reserved for travis deployments to live red cross environments. In order to deploy to a custom environment for development/testing purposes, add a file called config.custom.json. This file is ignored by git and will not be tracked by source control. It also supports two configurations that the others are not: "azureClientId" and "azureClientSecret". The travis builds pull these configurations out of environment variables, but a custom build expects these values to be in config.custom.json.

# Steps for running a deployment
- Create a new azure resource group
- In azure AD for the same subscription as the resource group, [create an app registration for the deploy agent](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-create-service-principal-portal), and keep track of the account secret created for it. See below for instructions on the needed role assignments.
- Grant the necessary roles for the deploy agent app at the resource group level, not at the subscription level. Required roles are 'Contributor' and 'Storage Blob Data Contributor (Preview)'.
- Pull down the project locally and run 'npm install' from the root of the project. The deploy script also assumes that the applications have already been built, so if they have not yet, `cd` into both the 'web' and 'api' projects and run `npm run build` from each.
- Before running, set two environment variables 'AzureClientId' and 'AzureClientSecret' containing the id and secret for the app registration created above.
- Finally, start the deployment by running `npm start` from the 'deploy' folder.
- If this is the first time running the script, it will fail after creating the azure key vault, because some of the deploy script steps require secrets to be present in it. Go into the resource group within the azure portal, find the newly created key vault, and create secrets for the values listed in this project's config/config.js file. The names of the key vault secrets must match the values in the config.js `$secrets` object. For example, in the pairing `"microsoftAppId": "MicrosoftAppId"`, the name of the secret must exactly match the right-hand value, i.e. "MicrosoftAppId". Once these are added to the key vault, run the deploy script again, the same as the step above describes.

# Testing changes to the deployment scripts

# Deploying from Travis CI


# Setting up Key Vault
Get app registration