import rcdaFunction from "@/functions/utils/rcdaFunction";
import ChatPromptRequest from "@common/models/services/chat-prompt/ChatPromptRequest";
import ChatPromptController from "@/chat/controllers/ChatPromptController";

class ChatPromptFunctionDependencies {

    constructor(public chatPromptController: ChatPromptController) {}

    static getInstance() {
        return new ChatPromptFunctionDependencies(ChatPromptController.getInstance());
    }
}

export default rcdaFunction<{request: ChatPromptRequest}, ChatPromptFunctionDependencies>(
    ChatPromptFunctionDependencies.getInstance,
    async ({ request }, { chatPromptController }) => {
        await chatPromptController.sendChatPrompt(request);
    }
);