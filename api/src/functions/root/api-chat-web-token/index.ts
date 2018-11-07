import { HttpStatusCode } from "azure-functions-ts-essentials";
import rcdaHttpFunction from "@/functions/utils/rcdaHttpFunction";
import ChatWebTokenResult from "@common/models/services/chat-web-token/ChatWebTokenResult";
import ChatWebTokenService from "@/services/ChatWebTokenService";

class ChatWebTokenDependencies {

  constructor(public chatWebTokenService: ChatWebTokenService) { }

  static getInstance() {
    return new ChatWebTokenDependencies(ChatWebTokenService.getInstance());
  }
}

export default rcdaHttpFunction<null, ChatWebTokenResult, ChatWebTokenDependencies>(
ChatWebTokenDependencies.getInstance,
true,
async (req, { chatWebTokenService }) => {

  let result = await chatWebTokenService.get();

  return {
    status: HttpStatusCode.OK,
    body: result
  };
});