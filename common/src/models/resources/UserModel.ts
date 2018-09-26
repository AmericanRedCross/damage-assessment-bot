import { RcdaRoles } from "@common/system/RcdaRoles";
import RcdaAuthenticationProviders from "@common/system/RcdaAuthenticationProviders";
 
export default class UserModel {
    id!: string;
    firstName: string|null = null;
    lastName: string|null = null;
    permissions: UserPermissionsModel = new UserPermissionsModel();
    accounts: UserAccountModel[] = [];
    chatAddresses: UserChatAddressModel[] = [];
    countries: UserCountryMembershipModel[] = [];
    lastActiveCountryId: string|null = null;
}

// Supporting Types
export class UserAccountModel {
    id!: string;
    provider!: RcdaAuthenticationProviders;
    sessionToken: string|null = null;
}

export class UserPermissionsModel {
    roles: RcdaRoles[] = [];
}

export class UserChatAddressModel {
    id!: string;
    value!: object;
}

export class UserCountryMembershipModel {
    id!: string;
    adminStacks: UserAdminStackMembership[] = [];
    lastActiveAdminStack: string|null = null;
} 

export class UserAdminStackMembership {
    id!: string;
}