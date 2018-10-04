import { Prompt, IPromptFeatures, IPromptOptions, IPromptContext  } from "botbuilder";

export class RcdaPromptAdaptiveCard extends Prompt<IPromptFeatures> {
    constructor(features?: IPromptFeatures) {
        super({
            defaultRetryPrompt: "Unable to determine input. Please try again.",
            defaultRetryNamespace: "BotBuilder"
            // recognizeScore: 1.0
        });
        
        this.updateFeatures(features);

        // Default recognizer logic
        this.onRecognize((context, cb) => {
            const form = context.message.value;

            if (form && !this.features.disableRecognizer) {
                cb(null, 1.0, form);
            } else {
                cb(null, 0.0);
            }
        });

        this.onFormatMessage((session, text, speak, callback) => {
            const context = (<IPromptContext>session.dialogData);
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
}