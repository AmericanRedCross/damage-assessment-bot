import ChatRegistrationRepo from "@/repo/ChatRegistrationRepo";
import ChatRegistrationRequest from "@common/models/services/chat-registration/ChatRegistrationRequest";
import RcdaError, { RcdaErrorTypes } from "@common/system/RcdaError";
import UserRepo from "@/repo/UserRepo";

export default class ChatRegistrationService {

    constructor(
        private chatRegistrationRepo: ChatRegistrationRepo,
        private userRepo: UserRepo) {}

    public static getInstance() {
        return new ChatRegistrationService(
            ChatRegistrationRepo.getInstance(),
            UserRepo.getInstance());
    }
    
    public async register(chatRegistrationRequest: ChatRegistrationRequest, userId: string): Promise<void> {

        let registration = await this.chatRegistrationRepo.get(chatRegistrationRequest.registrationToken)
        
        if (!registration) {
            throw new RcdaError(RcdaErrorTypes.ClientError, "The provided registration token is invalid.");
        }

        let user = await this.userRepo.get(userId);

        user.chatAddresses = user.chatAddresses || [];
        user.chatAddresses.push({
            id: registration.chatAddressId,
            value: registration.chatAddress
        });
        
        await this.chatRegistrationRepo.delete(registration.id);
        await this.userRepo.update(user);

        // try to message user (not a success precondition, fire and forget)
        // TODO - this feature may not ever be used, so this has not yet been implemented
    }
}