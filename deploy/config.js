const process = require("process");

// TODO remove, will come from travis
process.env["AzureClientId"] = "991b63a4-898f-4b6b-b599-db5db9942979";
process.env["AzureClientSecret"] = "O0n5E7O1SLYfLpC4Cnl9Ya9F+X91S7bHkpwoBU5SDGo=";

let environment = process.env["DeployEnvironment"] || "local";

let baseConfig = require("./config/config.json");
let envConfig = require(`./config/config.${environment}.json`);

let secrets = Object.assign({}, baseConfig.$secrets, envConfig.$secrets);
let config = Object.assign({}, baseConfig, envConfig);

delete config.$secrets;

validateConfigValuesAreSet(config, "config");
validateConfigValuesAreSet(secrets, "$secrets");

module.exports = { config, secrets };

function validateConfigValuesAreSet(configObject, configType) {
    for (let key in configObject) {
        if (!configObject[key] && typeof configObject[key] !== "boolean") {
            throw new Error(`Expected a value for ${configType} setting '${key}', but found '${String(config[key])}'`)
        }
    }
}
