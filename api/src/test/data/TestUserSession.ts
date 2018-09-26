import UserSession from "@common/models/resources/UserSession";
import { RcdaRoles } from "@common/system/RcdaRoles";
import DateUtility from "@/services/utils/DateUtility";

export class TestUserSession implements UserSession {

    userId: string;
    roles: RcdaRoles[] = [];
    issued: string;

    static Valid({ userId, roles }: Partial<{ userId: string, roles: RcdaRoles[] }> = {}) {
        return {
            userId: userId || "fake-user-id",
            roles: roles || [],
            issued: DateUtility.getInstance().currentDateString()
        }
    }
}