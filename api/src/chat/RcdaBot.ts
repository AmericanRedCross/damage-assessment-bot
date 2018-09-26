import { LuisRecognizer, UniversalBot, ChatConnector, MemoryBotStorage, Middleware, IConnector, IBotStorage, IUniversalBotSettings } from "botbuilder";
import { DocumentDbClient, AzureBotStorage } from "botbuilder-azure";
import { RcdaChatDialog, RcdaChatMiddleware } from "@/chat/utils/rcda-chat-types";
import rootDialog from "@/chat/dialogs/rootDialog";
import authenticationDialog from "@/chat/dialogs/authenticationDialog";
import authenticationMiddleware from "@/chat/middleware/authenticationMiddleware";
import myanmarFormDialogs from "@/chat/dialogs/disaster-assessment/myanmar/myanmarDisasterAssessmentDialog";
import promptReportDialog from "@/chat/dialogs/promptReportDialog";
import { registerRcdaPrompts } from "@/chat/prompts/RcdaPrompts"

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

        registerRcdaPrompts(this);

        this.addDialog(rootDialog);
        this.addDialog(authenticationDialog);
        this.addDialog(promptReportDialog);

        for (var myanmarFormDialog of myanmarFormDialogs) {
            this.addDialog(myanmarFormDialog)
        }

        // Recognizers
        this.recognizer(new LuisRecognizer(process.env.LuisConnectionString));
    }

    private addDialog(chatDialog: RcdaChatDialog): void {
        let dialog = this.dialog(chatDialog.id, chatDialog.dialog);

        if (chatDialog.options) {
            if (chatDialog.options.triggers) {
                for (const triggerDef of chatDialog.options.triggers) {
                    dialog.triggerAction(triggerDef);
                }
            }
        }
    }

    private useSessionMiddleware<TDependencies>(rcdaMiddleware: RcdaChatMiddleware<TDependencies>) {
        this.use({ botbuilder: rcdaMiddleware.sessionMiddleware })
    }
}