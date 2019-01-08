import { RcdaTypedSession } from "@/chat/utils/rcda-chat-types";

export function getUserId(session: RcdaTypedSession) {
    let userId = session.message.address.user.id;
    // this accounts for the prefix that the direct line authentication endpoint requires on all user ids
    if (userId.startsWith("dl_")) {
        return userId.slice("dl_".length);
    }
    return userId;
}