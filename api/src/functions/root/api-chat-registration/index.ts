import { HttpStatusCode } from "azure-functions-ts-essentials";
import rcdaHttpFunction from "@/functions/utils/rcdaHttpFunction";
import ChatRegistrationRequest from "@common/models/services/chat-registration/ChatRegistrationRequest";
import ChatRegistrationService from "@/services/ChatRegistrationService";

export class ChatRegistrationDependencies {

  constructor(public chatRegistrationService: ChatRegistrationService) {}

  static getInstance()  {
    return new ChatRegistrationDependencies(ChatRegistrationService.getInstance());
  }
}

export default rcdaHttpFunction<ChatRegistrationRequest, void, ChatRegistrationDependencies>(
  ChatRegistrationDependencies.getInstance,
  true,
  async (req, { chatRegistrationService }, { session }) => {

    await chatRegistrationService.register(req.body, session.userId);

    return { 
      status: HttpStatusCode.OK,
      body: null
    };
  });