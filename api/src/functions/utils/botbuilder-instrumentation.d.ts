declare module 'botbuilder-instrumentation' {
    
    export type IDictionary = { [ key: string ]: string;}

    export interface ISentimentSettings {
        minWords?: number,
        url?: string,
        id?: string,
        key?: string
    }

    export interface IAutoLogOptions {
        autoCollectConsole?: boolean;
        autoCollectExceptions?: boolean;
        autoCollectRequests?: boolean;
        autoCollectPerf?: boolean;
    }

    export interface IInstrumentationSettings {
        instrumentationKey?: string | string[];
        sentiments?: ISentimentSettings;
        omitUserName?: boolean;
        autoLogOptions?: IAutoLogOptions;
        customFields?: ICustomFields;
    }

    /**
     * This interface is used to pass custom fields to be logged from a session state array
     */
    export interface ICustomFields {
        userData?: string[];
        conversationData?: string[];
        privateConversationData?: string[];
        dialogData?: string[];
    }

    export class BotFrameworkInstrumentation {
        constructor(settings?: IInstrumentationSettings);

        monitor(bot: any, recognizer?: any): any;
    }
}