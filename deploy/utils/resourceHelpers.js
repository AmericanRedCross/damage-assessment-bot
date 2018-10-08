const { config } = require("./config");

function azureResource(type, id) {
    return `/subscriptions/${config.subscriptionId}/resourceGroups/${config.resourceGroupName}/providers/${type}/${id}`
}

function azureResourceUrl(type, id, apiVersion) {
    return `https://management.azure.com/${azureResource(type, id)}?api-version=${apiVersion}`
}

module.exports = {
    azureResource,
    azureResourceUrl
};