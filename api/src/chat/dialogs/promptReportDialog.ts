import rcdaChatDialog from "@/chat/utils/rcdaChatDialog";

export default rcdaChatDialog(
    "/promptReport",
    null,
    [
        ({ session }) => {
            session.send("It is time to file a report.");
        }
    ]);
