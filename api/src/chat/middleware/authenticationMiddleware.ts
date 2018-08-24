import UserModel from "@common/models/user/UserModel";
import UserRepo from "@/repo/UserRepo";
import authenticationDialog from "@/chat/dialogs/authenticationDialog";
import rcdaChatMiddleware from "@/chat/utils/rcdaChatMiddleware";

export default rcdaChatMiddleware(
    () => ({
        userRepo: UserRepo.getInstance()
    }),
    async ({ session, next }, { userRepo }) => {

        let authDialogNormalizedId = `*:${authenticationDialog.id}`;
        let authDialogIsActive = !!session.dialogStack().find(d => d.id === authDialogNormalizedId);
        let userSession: UserModel = session.userData.userSession;

        if (!authDialogIsActive && !userSession) {
            let address = session.message.address;
            let user = await userRepo.getByChatAddress({ channelId: address.channelId, userId: address.user.id});
            if (!user) {
                session.beginDialog(authenticationDialog.id);
                return;
            }
            else {
                session.userData.userSession = user;
            }
        }
        next();
    });