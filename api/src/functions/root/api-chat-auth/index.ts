import { HttpStatusCode } from "azure-functions-ts-essentials";
import rcdaHttpFunction from "@/functions/utils/rcdaHttpFunction";
import ChatAuthResult from "@common/models/services/chat-auth/ChatAuthResult";
import ChatAuthService from "@/services/chat/ChatAuthService";

class ChatWebTokenDependencies {

  constructor(public chatAuthService: ChatAuthService) { }

  static getInstance() {
    return new ChatWebTokenDependencies(ChatAuthService.getInstance());
  }
}

export default rcdaHttpFunction<null, ChatAuthResult, ChatWebTokenDependencies>(
ChatWebTokenDependencies.getInstance,
true,
async (req, { chatAuthService }, { session }) => {

  let result = await chatAuthService.getAuthenticatedSession(session.userId);

  return {
    status: HttpStatusCode.OK,
    body: result
  };
});