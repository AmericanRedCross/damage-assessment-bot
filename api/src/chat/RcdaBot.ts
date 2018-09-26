import { LuisRecognizer, UniversalBot, ChatConnector, MemoryBotStorage, Middleware, IConnector, IBotStorage, IUniversalBotSettings } from "botbuilder";
import { RcdaChatDialog, RcdaChatMiddleware } from "@/chat/utils/rcda-chat-types";
import rootDialog from "@/chat/dialogs/rootDialog";
import authenticationDialog from "@/chat/dialogs/authenticationDialog";
import authenticationMiddleware from "@/chat/middleware/authenticationMiddleware";
import myanmarFormDialogs from "@/chat/dialogs/disaster-assessment/myanmar/myanmarDisasterAssessmentDialog";
import promptReportDialog from "@/chat/dialogs/promptReportDialog";

export default class RcdaBot extends UniversalBot {
    static getInstance(): RcdaBot {
        const connector: ChatConnector = new ChatConnector({
            appId: process.env.MicrosoftAppId,
            appPassword: process.env.MicrosoftAppPassword
        });
        return new RcdaBot(connector, new MemoryBotStorage());
    }

    constructor(connector: IConnector, storage: IBotStorage) {
        super(connector, <IUniversalBotSettings>{ 
            storage: storage,
            defaultDialogId: rootDialog.id
        });
     
        this.use(Middleware.sendTyping());
        this.useSessionMiddleware(authenticationMiddleware);

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