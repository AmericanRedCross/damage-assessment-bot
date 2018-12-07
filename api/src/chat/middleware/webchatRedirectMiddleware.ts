import rcdaChatMiddleware from "@/chat/utils/rcdaChatMiddleware";
import { HeroCard, Message, CardAction } from "botbuilder";
import { RcdaTypedSession } from "@/chat/utils/rcda-chat-types";
import RcdaChatLocalizer from "@/chat/localization/RcdaChatLocalizer";

export const webchatRedirectMiddleware = rcdaChatMiddleware(
    null,
    ({ session, next, localizer }) => {
        if (session.message.address.channelId !== "webchat") {
            let redirectionHeroCard = new Message(session).addAttachment(createRedirectionHeroCard(session, localizer))
            session.send(redirectionHeroCard);
            return;
        }
        next();
});



function createRedirectionHeroCard(session: RcdaTypedSession, localizer: RcdaChatLocalizer) {
    let redirectionHeroCard = new HeroCard(session);
    let redirectCardAction = new CardAction(session).title(localizer.mm.redirectButtonText)
                                                    .type("openUrl")
                                                    .value(process.env["WebChatUrl"]);
    
    redirectionHeroCard.title(localizer.mm.unsupportedChannel);
    redirectionHeroCard.subtitle(localizer.mm.webchatRedirectToUrlMessage);
    redirectionHeroCard.buttons( [redirectCardAction] );

    return redirectionHeroCard;
}