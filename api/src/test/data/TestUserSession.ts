import UserSession from "@common/models/resources/UserSession";
import { RcdaRoles } from "@common/system/RcdaRoles";

export class TestUserSession implements UserSession {

    userId: string;
    roles: RcdaRoles[] = [];
    iat: number;
    exp: number;

    static Valid(customSessionValues: Partial<{ userId: string, roles: RcdaRoles[] }> = {}) {
        return {
            userId: "fake-user-id",
            roles: <RcdaRoles[]>[],
            iat: 0,
            exp: 0,
            ...customSessionValues
        }
    }
}