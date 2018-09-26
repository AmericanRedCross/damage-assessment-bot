import { HttpStatusCode } from "azure-functions-ts-essentials";
import rcdaHttpFunction from "@/functions/utils/rcdaHttpFunction";
import ChatPromptReportRequest from "@common/models/services/chat-prompt-report/ChatPromptReportRequest";
import ChatPromptReportService from "@/services/ChatPromptReportService";
import ChatPromptRequest from "@common/models/services/chat-prompt/ChatPromptRequest";
import { RcdaRoles } from "@common/system/RcdaRoles";

class ChatPromptFunctionDependencies {

  constructor(public chatPromptReportService: ChatPromptReportService) {}

  static getInstance() {
    return new ChatPromptFunctionDependencies(ChatPromptReportService.getInstance())
  }
}

export default rcdaHttpFunction<ChatPromptReportRequest, void, ChatPromptFunctionDependencies>(
  ChatPromptFunctionDependencies.getInstance,
  [RcdaRoles.DashboardAdmin],
  async (req, { chatPromptReportService }, { context }) => {

    let bindings = <{queueItems: ChatPromptRequest[]}>context.bindings;

    bindings.queueItems = await chatPromptReportService.getChatPromptQueueItems(req.body);

    return { 
      status: HttpStatusCode.Accepted,
      body: null
    };
  });