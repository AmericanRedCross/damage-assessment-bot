
// separate blob storage for the web app, or same?
// function app
// luis app
// bot channels registration
// cosmos db
// app insights
// key vault


secrets go in keyvault. config goes in source.
local dev scipt puts secrets on machine? or can that be avoided and only pulled in at runtime?
how are secrets put into appsettings?
 - referenced directly from keyvault?



 # New resource group setup
Add empty resource group
Add the app registration in AD
Add roles for the app registration at the resource group level, including Contributor and Storage Blob Data Contributor (Preview)
Do we need to put the role for blob data contributor on the storage account itself?



#TODO
add 'chat-prompt' queue to deployed storage account
deploy web app settings, get them accurate
give client app config for api endpoint
deploy luis