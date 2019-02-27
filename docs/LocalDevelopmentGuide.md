# Setting up a local development environment

## Getting Started
    1.	Clone the git repo locally.
    2.	From directory root, run `npm install`. This installs npm packages for all projects (web, api, & common), which have their own package.json files.

## Build and Run
    Before running the app locally, start the azure storage and cosmos emulators by running `./LocalDev.ps1` from the project root.

    To start the web app, change to the 'web' directory and run `npm run dev`. This supports editing files without having to restart the development server.

    To Start the api app, change to the 'api' directory and run `npm run build:dev` followed by `npm run start:dev`. To make changes, the app must be rebuilt and the server restarted.

## Test
    Tests are currently only available for 'api'. Change into the 'api' directory root and run `npm run test`, or for code coverage run `npm run test:coverage`.

## Initial Setup

### VS Code Workspace

The code base is optimized for development in VS Code workspaces. To start, open VS Code, select `File > Open Workspace...` (**Note, do NOT choose `File > Open Folder...`**), and then select `damage-assessment-bot.code-workspace`. The workspace uses a multi-root configuration that is necessary for VS Code to provide accurate intellisense and linting based on typescript configurations and package references for each independent project (api/web/common). Errors may be reported and tooling may not work correctly if you open the project as a folder.

**Note:** When opened as a workspace, the project root directory is visible as a folder called `/`. This is indeed the project root folder, not a subfolder. The sub-projects can not be accessed within this folder, they have been configured not to appear to reduce duplication and to encourage using the multi-root workspace folders for each sub-project.

### Installing packages

Packages will need to be installed when the project is first pulled down, or when a package.json file is updated with new dependencies.

Every sub-project (api, web, and common) has it's own package.json with their own dependencies. You can `cd` into the project root and run `npm install` to install packages for all sub-projects at once, or you can `cd` into each folder and run `npm install` for only the projects that you are actively developing in. The 'api' and 'web' projects reference code in 'common' and have been configured to automatically install 'common' packages when you run `npm install` on them.

## Building/Running the api (includes chatbot)

### Build

Any time code changes within the 'api', the project must be rebuilt. To rebuild for local development/debugging, `cd` into 'api' and run `npm run build:dev`. Note that `npm run build` is available, but this is intended for production builds and will not produce source maps needed for debugging.

### Run/Debug

The application can be started with or without the debugger attached. 

To start with the debugger, open the VS Code debugger panel (Ctrl + Shift + D), make sure that 'Attach to JavaScript Functions (api)' is selected from the top drop down, and click the green play button to start the app. With this running, you should be able to add break points in the typescript files within the 'src' folder (note that the 'dist' folder is only intended for build output and is not intended to be stepped through - source maps produced by the dev build allow debugging the source code directly) and can pause code execution, allowing for line stepping and variable inspection.

If the debugger is not needed, running the app from the command line can be somewhat faster. For this, `cd` into the 'api' folder and run `npm run start:dev`.

**Note:** The api's development server does not automatically react to source code changes, unlike the web UI server. If code is changed, you must stop the server, rebuild the code, and then start the server again.

## Running the web app

Building and running the web UI project is as simple as `cd`'ing into the 'web' folder and running `npm run dev`. This will build the project, start the server, and open up the landing page in your default browser. Unlike the 'api' project, it is not necessary to stop the development server when making source code changes. The web dev server will automatically detect changes to files in 'web/src', rebuild, and update the live web page to use the updated code (via hot module replacement - no page refresh needed, application state is preserved!).

## Testing the chat bot

### Chatting using the Bot Framework Emulator

The fastest and easiest way to get started talking to your bot and testing it is to install Microsoft's [Bot Framework Emulator](https://github.com/Microsoft/BotFramework-Emulator). Direct download link for the installer is available [here](https://github.com/Microsoft/BotFramework-Emulator/releases/download/v3.5.35/botframework-emulator-Setup-3.5.35.exe). This installs the emulator for BotFramework v3.3.35. Note that a version of the emulator is available for v4 of the bot framework, but since this is still in preview we are using the latest available v3 emulator.

### 

## Testing with a Facebook app

## Add registration credentials

https://docs.microsoft.com/en-us/azure/bot-service/bot-service-channel-connect-facebook?view=azure-bot-service-3.0

To test agains

### Create Facebook app and bot registration service

### Debug locally with Facebook app