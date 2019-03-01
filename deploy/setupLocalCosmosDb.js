const deployCosmos = require("./utils/deployCosmos");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

(async function() {

    try {
        // uses default settings for the cosmos db emulator
        await deployCosmos(null, {
            cosmosEndpoint: "https://localhost:8081", 
            cosmosKey: "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw=="
        });
    }
    catch (ex) {
        console.log(`Error: ${JSON.stringify(ex)}`);
    }

})();