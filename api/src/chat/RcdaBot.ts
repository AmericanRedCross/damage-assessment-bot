import { LuisRecognizer, UniversalBot, ChatConnector, MemoryBotStorage, Middleware, IConnector, IBotStorage, IUniversalBotSettings } from "botbuilder";
import { DocumentDbClient, AzureBotStorage } from "botbuilder-azure";
import { RcdaChatDialog, RcdaChatMiddleware } from "@/chat/utils/rcda-chat-types";
import { rootDialog } from "@/chat/dialogs/rootDialog";
import authenticationDialog from "@/chat/dialogs/authenticationDialog";
import authenticationMiddleware from "@/chat/middleware/authenticationMiddleware";
import promptReportDialog from "@/chat/dialogs/promptReportDialog";
import { registerRcdaPrompts } from "@/chat/prompts/RcdaPrompts"
import { conversationDataInitMiddleware } from "@/chat/middleware/conversationDataInitMiddleware";
import { channelDetectionMiddleware } from "@/chat/middleware/channelDetectionMiddleware";

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
            database: "Rcda",
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
        //this.useSessionMiddleware(authenticationMiddleware);
        this.useSessionMiddleware(channelDetectionMiddleware);
        this.useSessionMiddleware(conversationDataInitMiddleware);

        registerRcdaPrompts(this);

        this.addDialog(rootDialog);
        this.addDialog(authenticationDialog);
        this.addDialog(promptReportDialog);

        // Recognizers
        this.recognizer(new LuisRecognizer(process.env.LuisConnectionString));
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
}