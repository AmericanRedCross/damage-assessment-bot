import UserModel from "@common/models/resources/UserModel";
import { RcdaLanguages } from "@common/system/RcdaLanguages";

export default class RcdaBotUserData {
    lastUsedTownship: string;
    userSession: UserModel;
    userId: string;
    language: RcdaLanguages = RcdaLanguages.English;
}