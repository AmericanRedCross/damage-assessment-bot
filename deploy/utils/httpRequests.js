const axios = require("axios");

async function http(method, url, data, authToken, config, ignoreNotFound=false) {
    try {
        config = config || {};
        config.headers = config.headers || {};
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
        throw error;
    }
}

module.exports = {
    get: (url, authToken, config) => http("get", url, null, authToken, config, true),
    post: (url, data, authToken, config) => http("post", url, data, authToken, config),
    put: (url, data, authToken, config) => http("put", url, data, authToken, config)
}