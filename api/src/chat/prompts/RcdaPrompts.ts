import { Library, TextOrMessageType, Message } from "botbuilder";
import { RcdaTypedSession } from "@/chat/utils/rcda-chat-types";
import { RcdaPromptAdaptiveCard, IRcdaPromptAdaptiveCardOptions } from "@/chat/prompts/RcdaPromptAdaptiveCard";

const promptPrefix = '';//'Rcda:prompt-';

const RcdaPrompts = { adaptiveCard, adaptiveCardBuilder }
export default RcdaPrompts;

const adaptiveCardId = `${promptPrefix}adaptiveCard`;

export function registerRcdaPrompts(bot: Library) {
    bot.dialog(adaptiveCardId, new RcdaPromptAdaptiveCard());
}

function adaptiveCard(session: RcdaTypedSession, prompt: TextOrMessageType, options?: IRcdaPromptAdaptiveCardOptions) {
    let args: IRcdaPromptAdaptiveCardOptions = Object.assign({}, options);
    args.prompt = prompt || options.prompt;
    session.beginDialog(adaptiveCardId, args);
}

type RcdaAdaptiveCard = { type?: string, body: object[], actions: object[] };
function adaptiveCardBuilder(session: RcdaTypedSession, cardDefinition: RcdaAdaptiveCard, options?: IRcdaPromptAdaptiveCardOptions) {

    let prompt = new Message(session).addAttachment({
        contentType: "application/vnd.microsoft.card.adaptive",
        content: {
            type: "AdaptiveCard",
            ...cardDefinition
        }
    });

    adaptiveCard(session, prompt, options);
}

