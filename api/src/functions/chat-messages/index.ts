import { ChatConnector, MemoryBotStorage } from "botbuilder";
import RcdaBot from "@/chat/RcdaBot";

const connector: ChatConnector = new ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

const listener: any = connector.listen();

new RcdaBot(connector, new MemoryBotStorage());

// environment glue
module.exports = function (context: any, req: any): any {
    listener(req, context.res);
};