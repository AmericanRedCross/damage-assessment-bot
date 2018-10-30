import { Session, Library, TextOrMessageType } from "botbuilder";
import { RcdaPromptAdaptiveCard, IRcdaPromptAdaptiveCardOptions } from "@/chat/prompts/RcdaPromptAdaptiveCard";

const promptPrefix = 'Rcda:prompt-';

const RcdaPrompts = {
    adaptiveCard(session: Session, prompt: TextOrMessageType, options: IRcdaPromptAdaptiveCardOptions) {
        validateSession(session);
        let args: IRcdaPromptAdaptiveCardOptions = clone(options || {});
        args.prompt = prompt || options.prompt;
        session.beginDialog(promptPrefix + 'adaptiveCard', args);
    }
}
export default RcdaPrompts;

export function registerRcdaPrompts(bot: Library) {
    bot.dialog(`${promptPrefix}adaptiveCard`, new RcdaPromptAdaptiveCard());
}

function validateSession(session: Session): void {
    // Make sure that the session is passed, otherwise throw a clear error 
    if (!session || typeof session != 'object') {
        throw 'Session should be provided as first parameter.';
    }
}

function clone(obj: any): any {
    var cpy: any = {};
    if (obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                cpy[key] = obj[key];
            }
        }
    }
    return cpy;
}