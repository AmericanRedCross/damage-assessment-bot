
# Deployment Guide

## Sections
- [Standard Deployment Process](#standard-deployment-process)
- [First Time Deployment to a New Environment](#first-time-deployment-to-a-new-environment)
- [Deploying Feature Branches to Dev Environment](#deploying-feature-branches-to-dev-environment)
- [Running a Deployment Outside Travis](#running-a-deployment-outside-travis)

---------------------------------------

## Standard Deployment Process

The standard process for deploying changes to the Red Cross environments is to create a GitHub pull request to a branch associated with the target environment. The repo is integrated with Travis CI, which will automatically run a deployment when a new commit lands in one of these special branches.

The following shows which branches are associated to which environments.

| Branch    | Environment |
|:--------- |:------------|
| `master`  | Production  |
| `staging` | Stage/UAT   |
| `dev`     | Dev         |

NOTE: It is important to observe the intended flow for commits between branches, as described in the [branching strategy documentation](./BranchingStrategy.md). As a convenience for testing deployment of a feature branch before it has landed in `dev`, there is a way to [temporarily deploy any branch to the Development environment](#deploying-feature-branches-to-dev-environment) without making an actual commit in the `dev` branch.

---------------------------------------

## First Time Deployment to a New Environment

These steps describe setup that must be done to set up CI/CD for an environemnt and can be followed if an environment needs to be recreated from scratch. 

1. [Create an app registration for the deployment agent.](#app-registration-for-deploy-agent) Each environment should have it's own app registration with different credentials.
2. [Create an app registration for the chat bot.](#app-registration-for-the-chat-bot) Each environment needs a separate chat bot app registration.
3. [Add configurations to Travis CI as environment variables.](#Add-Configuration-to-Travis-CI-as-Environment-Variables)
4. Run a build on the branch for the target environment. 
5. Deploy will create a key vault and then end early. Go to the Azure portal and [add remaining configurations to the key vault as secrets.](#add-configurations-to-key-vault-as-secrets)
6. Re-run the build from step 4
7. Deployment will have succeeded, but there are a few remaining [one-time manual setup steps that must be done.](#Manual-one-time-post-deployment-steps)
8. [Get the generated URL for the web app.](#Finding-the-Web-App-URL)

### Create App Registrations

To create App Registrations, ensure that you have the proper permissions. You will need the permission to create an App Registration in the Azure Active Directory. If you don't have the permissions, ask your Active Directory Team to create the App Registration for you.

#### App registration for deploy agent
1.	Go to https://portal.azure.com, and navigate to the Azure Active Directory blade on the left side.
2. After the blade opens, click on 'App Registrations (Preview)' and then 'New registration'.
3.	Enter a name for the app registration, and then leave the other settings as they are. Click 'Register'.
4.	On the screen showing all app registrations, click on the newly created app registration and on the new blade you will see a value called 'Application ID'. Copy this and set it aside, you will need this to configure the deploy.
5. Click on 'Settings', then 'Keys' to add a password. Under the Passwords section, enter the Description for the key and duration for which it would be valid (Do get confirmation from your IT Security Team) and then hit the Save button.
7.	After saving, you will see the newly created key. This will only be shown once so copy the value right away and put it aside for when you configure the deploy.
8. You will need to grant this app registration permission to deploy to the target resource group, so navigate to that resource group in the portal (or create it if it doesn't exist yet), then open 'Access Control (IAM)'.
9. In the newly opened section click 'Add', then 'Add role assignment'.
10. In the role selector, add the following two roles:
    - Contributor
    - Storage Blob Data Contributor (It may be labelled 'Preview')
11. In the 'Assign access to' selector, find the name of your new app registration and select it. Finally, click 'Save'.

The outcome of these steps is a properly permissioned app registration for deployment, and two values that will be used to configure the deploy agent:
- `{EnvId}_DeployAgentClientId` - The value of 'Application ID' from step 4
- `{EnvId}_DeployAgentClientSecret` - The password created in step 6

#### App registration for the chat bot

The steps for configuring the chat bot app registration are nearly identical to the [steps for creating the deploy agent app registration](#app-registration-for-deploy-agent), with a couple important differences:
- On step 3, under 'Supported account types' select 'Accounts in any organizational directory'.
- Skip steps 8-11.

The outcome of these steps is a properly permissioned app registration for an Azure Bot Service, and two values that will be used to configure the deploy agent:
- `microsoftAppId` - The value of 'Application ID' from step 4
- `microsoftAppPassword` - The password created in step 6

### Add Configuration to Travis CI as Environment Variables

Visit the [Travis CI build settings page.](https://travis-ci.com/AmericanRedCross/damage-assessment-bot/settings)
Scroll down to the list of Environment Variables and add the appropriate values as described below. Because the project is open source, the build output is public, so be sure to configure any sensitive values as 

Following is the list of secrets which need to be configured for Travis CI/CD. Each credential is prefixed with an environment identifier. The supported identifiers are 'Dev', 'Stage', and 'Prod'.
```
{EnvId}_DeployAgentClientId  
{EnvId}_DeployAgentClientSecret  
{EnvId}_KeyVaultName 
{EnvId}_DeploymentRegion
{EnvId}_ResourceGroupName
{EnvId}_SubscriptionId  
{EnvId}_TenantId
```
Example with real prefix applied:
```
Stage_DeployAgentClientId  
Stage_DeployAgentClientSecret  
Stage_KeyVaultName 
Stage_DeploymentRegion
Stage_ResourceGroupName
Stage_SubscriptionId  
Stage_TenantId
```

### Add configurations to key vault as secrets

1. Login to the [Azure Portal](https://portal.azure.com) and navigate to the key vault in the app's resource group.
2. You will need to have the 'Contributor' role at the scope of the key vault resource or higher. If you don't, contact your admin for assistance.
3. On the left blade, click on 'Access Policies' and then click on 'Add new'.
4. Click on 'Select Service Principal' and search for your currently signed in account and select it.
5. Under 'Secret Permissions', select the following:
    - Get
    - List
    - Set
    - Delete
6. Click 'OK'. Once back on the 'Access Policies' screen be sure to click the 'Save' button.
7. Ensure that you give the appropriate access to the App Registration which was created for the deployment workflow.
8. Now, click on 'Secrets' on the left blade and then hit on 'Generate/Import' button.
8. Add a secret for each of the keys located in this repo's `deploy/config/config.keys.json` file. Do note that the key names are case sensitive!  
9. For the jsonWebTokenSignature key, ensure that you have a strong value and you keep this value safely with you. It is used to sign and verify user sessions, and if leaked can easily be used to impersonate any user or role.

### Manual one-time post-deployment steps

There are a couple steps that are not currently automated and need to be done manually the first time you set up an environment.

#### Configure Azure Functions to use v2

Until you perform this step, the app will be in v1 mode, which uses a different convention for configurations. As a result, certain settings, including the api URL definitions, won't be detected properly and will leave the app in a broken state.

To fix this, follow these steps:
1. Go to the Azure portal, then go to the app service (not the one labelled 'swap') within the environment's resource group. 
2. Click on 'Application settings'
3. On the settings page, there is a subsection also called 'Application settings' with a list of config values. Look in here for the setting called 'FUNCTIONS_EXTENSION_VERSION'. 
4. Click the text to the right of this setting that says 'Hidden value. Click to edit.' and make sure that this value is assigned `~2`.
5. Scroll back up to the top and click 'Save'.

#### Configure Chat Bot Direct Line Authentication

These steps configure the chat bot with the necessary authentication to work with the web chat interface. Until this is done, web chat will not work.

1. Go to the Azure Portal and navigate to the Bot Service in the app's resource group. It may also be labelled with the type 'Functions Bot'.
2. On the Bot Service blade, click 'Channels', then click on the globe-like icon under 'Add a featured channel'. When hovering over this icon, it should show the text 'Configure Direct Line channel'.
3. Scroll down to the section labelled 'Enhanced authentication options' and toggle the switch at the bottom to be 'Enabled'.
4. Error text will be displayed saying 'You must have at least one trusted origin.'. Click '+ Add trusted origin'.
5. Add the URL for the web app (**NOT** the URL for the backend API) and click 'Done'. If you don't have the URL, [you can get it from here.](#Finding-the-Web-App-URL)
6. Click 'Done' at the bottom of the page.

### Finding the Web App URL

The web app is not currently configured with a custom domain name. Instead, it is accessed via the URL generated for the resource by Azure storage. To find this, follow these steps:

1. Go to the Azure Portal and navigate to the storage account in the app's resource group.
2. In the left-hand menu, under the section 'Settings' click on 'Static website'.
3. The URL for your web app will be displayed on this screen under the label 'Primary endpoint'. **Do not use 'Secondary endpoint'.**

---------------------------------------

## Deploying Feature Branches to Dev Environment

It is possible to deploy any branch in the GitHub repo to the Development environment without creating a PR to dev. This is exclusively intended as a convenience for testing deployments and making sure the app runs as expected in Azure.

1. Go to the [Travis CI portal](https://travis-ci.com/) and login.
2. Open the 'AmericanRedCross/damage-assessment-bot' repo. You will need administrative access to the the repo in Travis. Contact your admin if you don't have it.
3. On the right-hand side of the screen you should see a menu button labelled 'More options'. Click this to expand.
4. In the expanded menu, click 'Trigger build'.
5. Under 'SELECT A BRANCH', choose any branch you want to deploy to Dev.
6. Under 'CUSTOM CONFIG', enter this exactly: `env: deploy=dev`
7. Kick off the deploy by clicking 'Trigger custom build' and the bottom.
8. Your deploy should have started, you can monitor it's progress by going to 'Build History' to selecting the active build associated with your selected branch.

---------------------------------------

## Running a Deployment Outside Travis

It is possible to run the deployment from the CLI on any machine. It can be useful for developers to deploy to personal resource groups/subscriptions for the purpose of quickly testing code changes to the app or the deployment script. The steps involved are slightly different for this kind of deployment. 

NOTE: These steps are not intended for deploying to the Red Cross environments. The [process described here](#standard-deployment-process) should be followed for this. It is insecure to store sensitive credentials and settings for an official environment on a developer's personal machine.

1. Using git, checkout the branch that you wish to deploy.
2. From the root of the project, run `npm install`.
3. Follow steps 1-3 of the [instructions for setting up a new environment.](#first-time-deployment-to-a-new-environment)
4. Open the deploy config file `deploy/config/config.values.json` and provide values for all fields. The field `useKeyVaultForConfig` can be left as `false`, unless you want to manage secrets in key vault, in which case look at the notes below.
5. From the root of the project, run `npm run deploy`. This will build the 'web' and 'api' projects and then execute the deploy script in 'custom' environment mode.
6. Wait for deploy to finish successfully. May take 10-15 minutes the first time, since is creating azure resources.
7. Follow the one-time manual setup steps [described here.](#Manual-one-time-post-deployment-steps)
8. [Get the generated URL for the web app.](#Finding-the-Web-App-URL)

### Using key vault for secrets during local execution of the deploy script.

If you want a locally executed deployment to look up configurations in azure key vault like a Travis build does, you can do so. Here are the steps to follow:

1. Follow steps 1-3 outlined directly above, in 'Running a Deployment Outside Travis'.
2. Follow step 4 of the above, except set the value of `useKeyVaultForConfig` to `true`. You may also leave the bottom half of the configuration values set to `null`. The top half are still required.
3. Follow step 5 of the above.
4. The first time you do this, the deploy will terminate early with a message about key vault being empty. If this applies to you, keep following the remaining steps.
5. [Add the remaining configuration values to key vault.](#add-configurations-to-key-vault-as-secrets)
6. Run the deployment script again (step 5 from above).
7. Follow steps 6-8 from the instructions above.