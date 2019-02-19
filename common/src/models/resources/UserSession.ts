import { RcdaRoles } from "@common/system/RcdaRoles";

export default interface UserSession {
    userId: string;
    roles: RcdaRoles[];
    iat: number; // Time that the session was issued in Unix time
    exp: number; // Time that the session expires in Unix time
}