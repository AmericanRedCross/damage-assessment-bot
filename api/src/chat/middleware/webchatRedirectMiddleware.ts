import rcdaChatMiddleware from "@/chat/utils/rcdaChatMiddleware";
import { HeroCard, Message, CardAction } from "botbuilder";
import { RcdaTypedSession } from "@/chat/utils/rcda-chat-types";
import RcdaChatLocalizer from "@/chat/localization/RcdaChatLocalizer";

export const webchatRedirectMiddleware = rcdaChatMiddleware(
    () => ({
        webChatUrl: process.env["WebAppUrl"] + "/chat"
    }),
    ({ session, next, localizer }, { webChatUrl }) => {
        const channelId = session.message.address.channelId;
        if (channelId !== "directline" && channelId !== "emulator") {
            session.send(localizer.mm.chatRedirectToWebAppMessage);
            session.send(new Message(session).addAttachment(createRedirectionHeroCard(session, localizer, webChatUrl)));
        }
        else {
            next();
        }
});



function createRedirectionHeroCard(session: RcdaTypedSession, localizer: RcdaChatLocalizer, webChatUrl: string): HeroCard {

    let redirectionHeroCard = new HeroCard(session);

    redirectionHeroCard.buttons([
        new CardAction(session)
            .title(localizer.mm.redirectButtonText)
            .type("openUrl")
            .value(webChatUrl)
    ]);

    return redirectionHeroCard;
}