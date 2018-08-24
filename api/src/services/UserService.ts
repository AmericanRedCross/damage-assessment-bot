import UserModel from "@common/models/user/UserModel";
import UserRepo from "@/repo/UserRepo";

export default class UserService {
    constructor(private userRepo: UserRepo) {
    }

    static getInstance(): UserService {
        return new UserService(UserRepo.getInstance());
    }
}