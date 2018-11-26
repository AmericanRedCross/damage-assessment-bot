import { ChatConnector, MemoryBotStorage } from "botbuilder";
import RcdaBot from "@/chat/RcdaBot";
import * as applicationInsights from "applicationinsights";
import { Context, HttpRequest, HttpMethod, HttpStatusCode } from "azure-functions-ts-essentials";


const connector = new ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

const listener: any = connector.listen();

RcdaBot.getInstance(connector);

module.exports = function (context: Context, req: HttpRequest): any {

    // TODO: evaluate more generic approaches/ TODO: evaluate more generic approaches
    // applicationInsights.setup(process.env.APPINSIGHTS_INSTRUMENTATIONKEY).start();

    if (req.method === HttpMethod.Get) {
        // Support HTTP GET for health check/warmup
        context.res = {
            status: HttpStatusCode.OK,
            body: null
        }
        context.done();
        return;
    } 

    listener(req, context.res);
};