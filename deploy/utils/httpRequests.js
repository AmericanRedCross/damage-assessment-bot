const axios = require("axios");
const asyncTimeout = require("./asyncTimeout");

async function http(method, url, data, authToken, config = {}, ignoreNotFound=false, transientErrorRetriesLeft=3) {
    try {
        if (!config.headers) {
            config.headers = {};
        }
        if (authToken) {
            config.headers["Authorization"] = `Bearer ${authToken}`;
        }
        if (data && !config.headers["Content-Type"]) {
            config.headers["Content-Type"] = "application/json";
        }
        config.maxContentLength = 100000000;
        let response = await axios({ method, url, data, ...config });
        return response;
    }
    catch (error) {
        let response = error.response;
        if (ignoreNotFound && response && response.status === 404) {
            return response;
        }
        if (response.status >= 500 && transientErrorRetriesLeft > 0) {
            console.log(`HTTP request failed with error ${response.status}. Trying again in 15 seconds (${transientErrorRetriesLeft} retries remaining).`);
            await asyncTimeout(15000);
            return await http(method, url, data, authToken, config, ignoreNotFound, transientErrorRetriesLeft - 1);
        }
        throw error;
    }
}

module.exports = {
    get: (url, authToken, config) => http("get", url, null, authToken, config, true),
    post: (url, data, authToken, config) => http("post", url, data, authToken, config),
    put: (url, data, authToken, config) => http("put", url, data, authToken, config)
}