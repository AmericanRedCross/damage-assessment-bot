const querystring = require('querystring');
const process = require("process");
const { config } = require("./config");
const { get, post, put } = require("./httpRequests");

module.exports = async function authenticate(resource) {

    let response = await post(`https://login.microsoftonline.com/${config.tenantId}/oauth2/token?api-version=1.0`, 
        querystring.stringify({
            "grant_type": "client_credentials",
            "client_id": process.env["AzureClientId"],
            "client_secret": process.env["AzureClientSecret"],
            "resource": resource
        }),
        null, { 
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

    return response.data["access_token"];
}