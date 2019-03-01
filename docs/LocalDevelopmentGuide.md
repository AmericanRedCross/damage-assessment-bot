# Setting up a local development environment

## Quick Start
1. [Install dependencies](#Installing-dependencies)
2. [Add app configuration settings](#Configuring-the-app)
3. [Setup emulators](#Emulator-setup)
4. [Build and run](#Running-the-app)

### Installing dependencies

1. Ensure that you have the following installed
    - git
    - node.js
    - Azure Storage Emulator
    - Azure Cosmos DB Emulator
    - Bot Framework Emulator
    - ngrok (optional, used for advanced debug scenarios)
2. Run `npm install` at the command line from the project root. This will install all required node packages and perform some additional initialization.

### Configuring the app

The API project requires a few configurations to be set. The configuration file will be located at `api/src/functions/root/local.settings.json`. Most of the settings in the file are pre-populated with values for local development, but some are empty. Ensure that all settings are assigned a value. Descriptions are provided for several of these settings in `deploy/config/config.keys.json`. Changes to this file are ignored by git and is for personal use.

The frontend web app also has a config file located at `web/src/config/config.custom.json`. This only has one setting, which is the URL for the backend REST API. By default it will point at the localhost port where the development server runs. It can be updated to point at an Azure environment if desired. Changes to this file are also ignored as it is intended for personal use. Note that this file will be used by builds for [custom deployments](./DeploymentGuide.md##running-a-deployment-outside-travis), so be sure to have it point to the deployment-provisioned azure storage if you are running a deployment.

### Emulator setup

For regular use, the only thing to remember is that the Azure Storage and Cosmos DB emulators must be running for the API/Web apps to function correctly. There is a convenience powershell script to start both emulators located at the root of the project called `StartAzureEmulators.ps1`.

In addition to that, it is necessary to setup the required Cosmos DB databases/collections. This can be done as follows:
1. Make sure the Cosmos emulator is currently running (i.e. you ran `StartAzureEmulators.ps1`).
2. From the project root, run `npm run setup-local-db`.
3. Open the cosmos explorer and verify that databases/collections have been created for the app.

Running this script again is a non-destructive operation, all data and customized settings will remain intact. This step only needs to be performed once, but if you wish to delete the database to clear existing app data this script will be useful for getting things set back up. 

### Running the app

Before running the app, ensure that the Azure Storage and Cosmos DB [emulators are running.](#Emulator-setup)

#### API App

The below instructions assume that your command line has set `api` as the working directory.

- To create a build for development, run `npm run build:dev`
- Once built, start the app with `npm run start:dev`, which will start the Azure Functions local runtime and host the app like a regular REST API server.
- As a convenience, running `npm run restart:dev` will run a build and then start the server in a single command.
- A production-grade build can be created by running `npm run build`. This is what gets used during deployment.
- The project has some minimal support for unit tests. These can be started with `npm run test`.

#### Web App

The below instructions assume that your command line has set `web` as the working directory.

- The web app has an automatically reloading development server. It can be started with `npm run dev`. This will run a dev build on the app and start the local server, and it will detect changes to web app code and automatically rebuild and update the web app in your browser.
- If you want to run a build without the dev server, you can use `npm run build:dev` for a development build (not minified, includes source map for debugging) or `npm run build` for a production-grade build.

### Development Tooling

The code base is optimized for development in VS Code workspaces. To start, open VS Code, select `File > Open Workspace...` (**Note, do NOT choose `File > Open Folder...`**), and then select `damage-assessment-bot.code-workspace`. The workspace uses a multi-root configuration that is necessary for VS Code to provide accurate intellisense and linting based on typescript configurations and package references for each independent project (api/web/common). Errors may be reported and tooling may not work correctly if you open the project as a folder.

**Note:** When opened as a workspace, the project root directory is visible as a folder called `/`. This is indeed the project root folder, not a subfolder. The sub-projects can not be accessed within this folder, they have been configured not to appear to reduce duplication and to encourage using the multi-root workspace folders for each sub-project.