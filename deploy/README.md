# What's in this folder?
This folder contains various utilities and scripts which would help in the provisioning & configuration of infrastructure required for a fully functional Chatbot.

# Countries supported
The bot currently has support of taking information for the following countries -
    * Myanmar

# Languages supported
The bot currently supports interaction in the following languages -
    * English
    * Burmese (Unicode)


# Pre-Requisites to deploying infrastructure
Before proceeding ahead with the deployment, please ensure that you meet the following -
    1. Active Azure Subscription
    2. An Azure account having Contributor rights to atleast the resource group where deployment will be done.
    3. 

# Config.Values.Json
    This section describes each parameter inside the "config.values.json" file and what kind of values are accepted. Following is the current list of parameters ==
        1. tenantId - This is the ID of the Active Directory where the Bot Resides. For Red Cross, it would be the Azure Active directory ID of the American Red Cross
        2. subscriptionId -- This is the Subscription ID where the deployment would be taking place. Ensure that you are **not using** the actual name of the subscription but the subscription ID (which is a GUID) because otherwise, the deployment will fail.
        3. resourceGroupName -- This is the name of the resource group where the Bot and its required infrastructure would be deployed. It is generally suggested to have separate resource groups for separate environments.
        4. keyVaultName -- This is the name of the Azure Key Vault which would be deployed to store secrets for the Bot.
        5. deployAgentClientId -- This is the application/client ID which is generated after creating an app registration. This parameter should contain the App Id which would be used for deployments.
        6. deployAgentClientSecret -- This is the app secret which can be created after the app registration is complete. This is used along with the "deployAgentClientId" to authenticate and deploy resources. Please ensure that you are aware of the expiry of this secret (if any).
        7. useKeyVaultForConfig -- 

# Configuration Settings & Values for the Chatbot
    1. FUNCTIONS_WORKER_RUNTIME = "node"
    2. FUNCTIONS_EXTENSION_VERSION = "~2"
    3. MicrosoftAppId = ""
    4. MicrosoftAppPassword = ""
    5. AzureWebJobsStorage = ""
    6. APPINSIGHTS_INSTRUMENTATIONKEY = ""
    7. CosmosDbHost = ""
    8.  CosmosDbKey = "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw=="
    9.  IfrcGoHost = ""
    10. JsonWebTokenSignature = "fakesignature"
    11. BotServiceWebChatSecret = ""

# Types of App Registrations required
    There are two app registrations required for the application to work properly
        1. The first registration is required for deployments (With Contributor rights)
        2. The second app registration is required for the Bot to authenticate with the Connector service

# Steps to configure Application ID & Application Password for authenticating bot
    1. Go to "https://apps.dev.microsoft.com/#/appList"
    2. 

# Steps to deploy infrastructure

# Steps to configure Travis CI

# Configuration Settings for Travis CI
    * Dev_KeyVaultName
    * Dev_Location
    * Dev_ResourceGroupName
    * Dev_SubscriptionId
    * Stage_KeyVaultName
    * Stage_Location
    * Stage_ResourceGroupName
    * Stage_SubscriptionId
    * DeployAgentClientId
    * DeployAgentClientSecret
    * TenantId

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