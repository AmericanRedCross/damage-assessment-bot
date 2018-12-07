import rcdaChatMiddleware from "@/chat/utils/rcdaChatMiddleware";

export const channelDetectionMiddleware = rcdaChatMiddleware(
    null,
    ({ session, next }) => {
        if (session.message.address.channelId !== "webchat") {
            session.send("We currently do not support this channel. Please visit us at - https://example.com for proceeding ahead.");
            return;
        }
        next();
    });