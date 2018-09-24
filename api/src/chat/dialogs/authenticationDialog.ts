import { SuggestedActions, CardAction, Message } from "botbuilder";
import ChatRegistrationRepo from "@/repo/ChatRegistrationRepo";
import UserRepo from "repo/UserRepo";
import rcdaChatDialog from "@/chat/utils/rcdaChatDialog";

export default rcdaChatDialog(
    "/authentication",
    () => ({
        chatAddressRepo: ChatRegistrationRepo.getInstance(),
        userRepo: UserRepo.getInstance()
    }),
    [
        async function ({ session }, { chatAddressRepo, userRepo }) {
            let address = session.message.address;
            let registrationToken = await chatAddressRepo.setupRegistrationToken(address);
            let loginText = `Hi! It looks like you haven't registered yet. Please sign and register to continue. Registration token: ${registrationToken}`;
            let url = `http://localhost:8080/#/register`;
            var msg: Message = new Message(session)
                                .text(loginText)
                                .suggestedActions(SuggestedActions.create(
                                    session,
                                    [
                                        CardAction.openUrl(session, url, "Sign In")
                                    ]
                                ));
            session.send(msg);
            session.endDialog();

        },
        function ({ session, result }) {
            session.userData.name = result.response;
            session.endDialog("Hi %s. Now tell me something", session.userData.name);
        }
    ]);
