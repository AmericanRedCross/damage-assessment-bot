import ChatPromptReportRequest from "@common/models/services/chat-prompt-report/ChatPromptReportRequest";
import UserRepo from "@/repo/UserRepo";
import ChatPromptRequest, { ChatPromptRequestType } from "@common/models/services/chat-prompt/ChatPromptRequest";
import RcdaCountries from "@common/system/RcdaCountries";
import RcdaError, { RcdaErrorTypes } from "@common/system/RcdaError";
import enumContainsValue from "@common/utils/enumContainsValue";

export default class ChatPromptReportService {

    constructor(private userRepo: UserRepo) {}

    public static getInstance() {
        return new ChatPromptReportService(UserRepo.getInstance());
    }
        
    public async getChatPromptQueueItems(chatPromptRequest: ChatPromptReportRequest): Promise<ChatPromptRequest[]> {

        if (!enumContainsValue(RcdaCountries, chatPromptRequest.country)) {
            throw new RcdaError(RcdaErrorTypes.ClientError, "Invalid country specified in request");
        }

        //TODO filter by admin stack
        let users = await this.userRepo.getAllByCountry(chatPromptRequest.country);

        let chatPrompts: ChatPromptRequest[] = [];
        
        for (const user of users) {
            if (user.chatAddresses) {
                for (const address of user.chatAddresses) {
                    chatPrompts.push({
                        chatAddress: address.value,
                        requestType: ChatPromptRequestType.PromptReport
                    });
                }
            }
        };

        return chatPrompts;
    }
}