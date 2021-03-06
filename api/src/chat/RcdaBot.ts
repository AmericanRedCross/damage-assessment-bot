import { LuisRecognizer, UniversalBot, ChatConnector, MemoryBotStorage, Middleware, IConnector, IBotStorage, IUniversalBotSettings } from "botbuilder";
import { DocumentDbClient, AzureBotStorage, IMessage } from "botbuilder-azure";
import { RcdaChatDialog, RcdaChatMiddleware } from "@/chat/utils/rcda-chat-types";
import { rootDialog } from "@/chat/dialogs/rootDialog";
import { registerRcdaPrompts } from "@/chat/prompts/RcdaPrompts"
import { conversationDataInitMiddleware } from "@/chat/middleware/conversationDataInitMiddleware";
import { webchatRedirectMiddleware  } from "@/chat/middleware/webchatRedirectMiddleware";
import RcdaChatLocalizer from "@/chat/localization/RcdaChatLocalizer";
import { RcdaChatEventDefinition } from "@/chat/utils/rcdaChatEvent"
import setLanguageEvent, { approveLanguageChangeDialog } from "@/chat/events/setLanguageEvent";

export default class RcdaBot extends UniversalBot {
    static getInstance(connector: ChatConnector = null): RcdaBot {
        if (!connector) {
            connector = new ChatConnector({
                appId: process.env["MicrosoftAppId"],
                appPassword: process.env["MicrosoftAppPassword"]
            });
        }
        const cosmosClient = new DocumentDbClient({
            host: process.env["CosmosDbHost"],
            masterKey: process.env["CosmosDbKey"],
            database: "RcdaFixedSize",
            collection: "ChatBotStorage"
        });
        const cosmosStorage = new AzureBotStorage({ gzipData: false }, cosmosClient);
        return new RcdaBot(connector, cosmosStorage);
    }

    constructor(connector: IConnector, storage: IBotStorage) {
        super(connector, <IUniversalBotSettings>{ 
            storage: storage,
            defaultDialogId: rootDialog.id
        });
    
        this.use(Middleware.sendTyping());
        this.useSessionMiddleware(webchatRedirectMiddleware);
        this.useSessionMiddleware(conversationDataInitMiddleware);

        registerRcdaPrompts(this);

        this.addDialog(rootDialog);

        // Events 
        this.registerEventListener(setLanguageEvent);
        
        // registers a single event listener to handle all rcda events
        this.on("event", this.rcdaEventHandler.bind(this));
    }

    private readonly _registeredDialogs: RcdaChatDialog[] = [];
    private addDialog(chatDialog: RcdaChatDialog): void {
        
        if (!chatDialog) {
            let lastRegisteredDialog = this._registeredDialogs.slice(-1)[0] || { id: "null" };
            throw new Error(`chatDialog argument cannot be null. Last successfully added dialog: ${lastRegisteredDialog.id}`);
        }

        if (this._registeredDialogs.includes(chatDialog)) {
            // if already registered, exit (prevents reference loops)
            return;
        }

        let dialog = this.dialog(chatDialog.id, chatDialog.dialog);
        this._registeredDialogs.push(chatDialog);

        if (!chatDialog.options) {
            // if no options to setup, exit
            return;
        }
        let { triggers, references } = chatDialog.options;
        
        if (triggers) {
            for (const triggerDef of triggers) {
                dialog.triggerAction(triggerDef);
            }
        }

        if (references) {
            if (typeof references === "function") {
                references = references();
            }
            for (var referencedDialog of references) {
                this.addDialog(referencedDialog);
            }
        }
    }

    private useSessionMiddleware<TDependencies>(rcdaMiddleware: RcdaChatMiddleware<TDependencies>) {
        this.use({ botbuilder: rcdaMiddleware.sessionMiddleware });
    }

    private _registeredEvents: { [key: string]: RcdaChatEventDefinition<any> } = {};
    
    private registerEventListener(eventDefinition: RcdaChatEventDefinition<any>) {
        this._registeredEvents[eventDefinition.name] = eventDefinition;
        
        if (eventDefinition.config && eventDefinition.config.references) {
            let references = eventDefinition.config.references();
            for (var referencedDialog of references) {
                this.addDialog(referencedDialog);
            }
        }
    }

    private rcdaEventHandler(message: IMessage&{ name: string, value: string }) {
        let eventDefinition = this._registeredEvents[message.name];
        if (!eventDefinition) {
            return;
        }
        this.loadSession(message.address, (error, session) => {
            if (!error) {
                let value = message.value;
                let localizer = new RcdaChatLocalizer(session);
                let dependencies = eventDefinition.dependencyFactory ? eventDefinition.dependencyFactory() : null;

                // there appears to be a bug(?) where the session generated by loadSession() does not recognize
                // dialogs when using session.beginDialog() unless they are prefixed by '*:'. This monkeypatches that in.

                eventDefinition.eventHandler({ value, session, localizer }, dependencies)
            }
        });
    }
}