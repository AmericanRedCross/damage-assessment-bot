const querystring = require('querystring');
const { post } = require("./httpRequests");

module.exports = async function authenticate(resource, configValues) {

    let response = await post(`https://login.microsoftonline.com/${configValues.tenantId}/oauth2/token?api-version=1.0`, 
        querystring.stringify({
            "grant_type": "client_credentials",
            "client_id": configValues.deployAgentClientId,
            "client_secret": configValues.deployAgentClientSecret,
            "resource": resource
        }),
        null, { 
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

    return response.data["access_token"];
}