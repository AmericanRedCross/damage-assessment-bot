# Getting Started
    1.	Clone the git repo locally.
    2.	From directory root, run `npm install`. This installs npm packages for all projects (web, api, & common), which have their own package.json files.

# Build and Run
    Before running the app locally, start the azure storage and cosmos emulators by running `./LocalDev.ps1` from the project root.

    To start the web app, change to the 'web' directory and run `npm run dev`. This supports editing files without having to restart the development server.

    To Start the api app, change to the 'api' directory and run `npm run build:dev` followed by `npm run start:dev`. To make changes, the app must be rebuilt and the server restarted.

# Test
    Tests are currently only available for 'api'. Change into the 'api' directory root and run `npm run test`, or for code coverage run `npm run test:coverage`.