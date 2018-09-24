import RcdaRoles from "@common/system/RcdaRoles";

export default interface UserModel {
    id: string;
    roles: RcdaRoles[];
    chatChannels: { [channelId: string]: string } //{ channelId: userId }
}