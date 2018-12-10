import rcdaChatDialog from "@/chat/utils/rcdaChatDialog";

export default rcdaChatDialog(
    "/unsupportedChannel",
    null,
    [
        ({ session, localizer }) => {
            session.send(localizer.common.unsupportedChannel);
            session.endDialog();
        }
    ]
);