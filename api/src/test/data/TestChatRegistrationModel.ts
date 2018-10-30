import ChatRegistrationModel from "@common/models/resources/ChatRegistrationModel";

export default class TestChatRegistrationModel extends ChatRegistrationModel {
    
    static Valid(id?: string, chatAddressId?: string): TestChatRegistrationModel {
        let model = new TestChatRegistrationModel();

        model.chatAddress = {};
        model.chatAddressId = chatAddressId || "fake-chat-address"
        model.id = id || "FAKE01";

        return model;
    }
}