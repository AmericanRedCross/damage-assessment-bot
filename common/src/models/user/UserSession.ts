import RcdaRoles from "@common/system/RcdaRoles";

export default interface UserSession {
    username: string;
    roles: RcdaRoles[];
    expires: string;
}