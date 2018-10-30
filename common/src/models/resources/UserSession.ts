import { RcdaRoles } from "@common/system/RcdaRoles";

export default interface UserSession {
    userId: string;
    roles: RcdaRoles[];
    issued: string; // Date and time that the session started
}