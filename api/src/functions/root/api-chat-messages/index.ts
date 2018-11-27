import { ChatConnector } from "botbuilder";
import RcdaBot from "@/chat/RcdaBot";
import { Context, HttpRequest, HttpMethod, HttpStatusCode } from "azure-functions-ts-essentials";
import { BotFrameworkInstrumentation } from "botbuilder-instrumentation";

const connector = new ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

const listener: any = connector.listen();

let bot = RcdaBot.getInstance(connector);

let logging = new BotFrameworkInstrumentation({
    instrumentationKey: process.env.APPINSIGHTS_INSTRUMENTATIONKEY,
    // Will omit the user name from the logs for anonimization
    omitUserName: true,
    // Application insights options, all set to false by default
    autoLogOptions: { 
      autoCollectConsole: true,
      autoCollectExceptions: true,
      autoCollectRequests: true,
      autoCollectPerf: true // (auto collect performance)
    }
})

logging.monitor(bot);

module.exports = function (context: Context, req: HttpRequest): any {

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