import { Library, TextOrMessageType, Prompts } from "botbuilder";
import { RcdaTypedSession } from "@/chat/utils/rcda-chat-types";
import { RcdaPromptAdaptiveCard, IRcdaPromptAdaptiveCardOptions } from "@/chat/prompts/RcdaPromptAdaptiveCard";

const promptPrefix = '';//'Rcda:prompt-';

const RcdaPrompts = { adaptiveCard }
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