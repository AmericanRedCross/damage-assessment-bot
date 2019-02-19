import { Prompt, IPromptFeatures, IPromptOptions, IPromptContext, Session  } from "botbuilder";

interface RcdaPromptContext<TOptions extends IPromptOptions> extends IPromptContext {
    options: TOptions;
}

export class RcdaPromptAdaptiveCard extends Prompt<IPromptFeatures> {

    constructor(features?: IPromptFeatures) {
        super({
            defaultRetryPrompt: "retry_adaptive_card",
            defaultRetryNamespace: "BotBuilder"
            // recognizeScore: 1.0
        });
        
        this.updateFeatures(features);

        // Default recognizer logic
        this.onRecognize((context, cb) => {

            const form = context.message.value;

            const isCurrentCard = form && form.rcdaAdaptiveCardId === context.dialogData.options.rcdaAdaptiveCardId;
            
            if (isCurrentCard && !this.features.disableRecognizer) {
                cb(null, 1.0, form);
            } else {
                cb(null, 0.0);
            }
        });

        this.onFormatMessage((session, text, speak, callback) => {
            const context = <RcdaPromptContext<IRcdaPromptAdaptiveCardOptions>>session.dialogData;
            const options = context.options;
            const turnZero = context.turns === 0 || context.isReprompt;
            const message = session.message.text

            if (!turnZero) {
                callback(null, null);
            } else {
              callback(null, null);
            }
        });

        // Add repeat intent handler
        this.matches('BotBuilder.RepeatIntent', (session) => {
            // Set to turn-0 and re-prompt.
            (<IPromptContext>session.dialogData).turns = 0;
            this.sendPrompt(session);
        });
    }
}

export interface IRcdaPromptAdaptiveCardOptions extends IPromptOptions {
    //TODO define options? specify whether can be re-submitted? can that be implemented here?
    rcdaAdaptiveCardId: string;
}