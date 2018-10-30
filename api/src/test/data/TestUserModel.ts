import UserModel from "@common/models/resources/UserModel";

export default class TestUserModel extends UserModel {
    
    static Valid(id?: string): UserModel {
        let model = new UserModel();

        model.id = id || "fake-user-id";

        return model;
    }
}