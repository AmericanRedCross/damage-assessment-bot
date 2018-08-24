import { UniversalBot, ISessionMiddleware, Middleware, IConnector, IBotStorage, IUniversalBotSettings } from "botbuilder";
import { RcdaChatDialog, RcdaChatMiddleware } from "@/chat/utils/rcda-chat-types";
import rootDialog from "@/chat/dialogs/rootDialog";
import authenticationDialog from "@/chat/dialogs/authenticationDialog";
import authenticationMiddleware from "@/chat/middleware/authenticationMiddleware";

export default class RcdaBot extends UniversalBot {
    constructor(connector: IConnector, storage: IBotStorage) {
        super(connector, <IUniversalBotSettings>{ 
            storage: storage,
            defaultDialogId: rootDialog.id
        });
     
        this.use(Middleware.sendTyping());
        this.useSessionMiddleware(authenticationMiddleware);

        this.addDialog(rootDialog);
        this.addDialog(authenticationDialog);
    }

    addDialog(chatDialog: RcdaChatDialog): void {
        this.dialog(chatDialog.id, chatDialog.dialog);
    }

    useSessionMiddleware<TDependencies>(rcdaMiddleware: RcdaChatMiddleware<TDependencies>) {
        this.use({ botbuilder: rcdaMiddleware.sessionMiddleware })
    }
}