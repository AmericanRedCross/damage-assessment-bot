import { SuggestedActions, CardAction, Message } from "botbuilder";
import ChatRegistrationRepo from "@/repo/ChatRegistrationRepo";
import UserRepo from "@/repo/UserRepo";
import rcdaChatDialog from "@/chat/utils/rcdaChatDialog";
import { getRegistrationToken } from "../utils/getChatRegistrationToken";
import getChatAddressId from "../utils/getChatAddressId";

export default rcdaChatDialog(
    "/authentication",
    () => ({
        chatRegistrationRepo: ChatRegistrationRepo.getInstance(),
        userRepo: UserRepo.getInstance()
    }),
    [
        async function ({ session }, { chatRegistrationRepo, userRepo }) {
            let address = session.message.address;

            let registrationToken = getRegistrationToken();
            await chatRegistrationRepo.create({
                id: registrationToken,
                chatAddressId: getChatAddressId(address),
                chatAddress: address
            });

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
        }
    ]);
