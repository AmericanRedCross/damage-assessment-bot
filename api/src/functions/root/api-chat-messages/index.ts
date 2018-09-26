import { ChatConnector, MemoryBotStorage } from "botbuilder";
import RcdaBot from "@/chat/RcdaBot";
import * as applicationInsights from "applicationinsights";

const connector = new ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

const listener: any = connector.listen();

RcdaBot.getInstance(connector);

module.exports = function (context: any, req: any): any {

    // TODO: evaluate more generic approaches/ TODO: evaluate more generic approaches
    // applicationInsights.setup(process.env.APPINSIGHTS_INSTRUMENTATIONKEY).start();

    listener(req, context.res);
};