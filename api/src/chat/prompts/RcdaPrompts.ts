import { Library, Message } from "botbuilder";
import { RcdaTypedSession } from "@/chat/utils/rcda-chat-types";
import { RcdaPromptAdaptiveCard, IRcdaPromptAdaptiveCardOptions } from "@/chat/prompts/RcdaPromptAdaptiveCard";
import * as uuid from "uuid";

const promptPrefix = '';//'Rcda:prompt-';

const RcdaPrompts = { adaptiveCard }
export default RcdaPrompts;

const adaptiveCardId = `${promptPrefix}adaptiveCard`;

export function registerRcdaPrompts(bot: Library) {
    bot.dialog(adaptiveCardId, new RcdaPromptAdaptiveCard());
}

type RcdaAdaptiveCard = { type?: string, body: object[], actions: { type: string, title: string, data?: any}[] };
function adaptiveCard(session: RcdaTypedSession, cardDefinition: RcdaAdaptiveCard, options?: IRcdaPromptAdaptiveCardOptions) {

    let args: IRcdaPromptAdaptiveCardOptions = Object.assign({}, options);

    args.rcdaAdaptiveCardId = uuid();

    let cardContent = {
        type: "AdaptiveCard",
        ...cardDefinition
    };

    for (let cardAction of cardContent.actions) {
        cardAction.data = {
            ...cardAction.data,
            rcdaAdaptiveCardId: args.rcdaAdaptiveCardId
        };
    }

    let prompt = new Message(session).addAttachment({
        contentType: "application/vnd.microsoft.card.adaptive",
        content: cardContent
    });

    args.prompt = prompt || options.prompt;

    session.beginDialog(adaptiveCardId, args);
}

