import { ChatConnector, UniversalBot, Middleware, Prompts, MemoryBotStorage } from "botbuilder";

const connector: ChatConnector = new ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});
const listener: any = connector.listen();
const bot: any = new UniversalBot(connector, { storage: new MemoryBotStorage() });

bot.dialog("/", function (session: any): any {
    session.sendTyping();
    session.send("%s said %s", session.userData.name, session.message.text);
});

bot.use(Middleware.firstRun({ version: 1.0, dialogId: "*:/intro" }));
bot.dialog("/intro", [
    function (session: any): any {
        Prompts.text(session, "Hi! what's your name?");
    },
    function (session: any, results: any): any {
        session.userData.name = results.response;
        session.endDialog("Hi %s. Now tell me something", session.userData.name);
    }
]);

// environment glue
module.exports = function (context: any, req: any): any {
    context.log("Passing body", req.body);
    listener(req, context.res);
};