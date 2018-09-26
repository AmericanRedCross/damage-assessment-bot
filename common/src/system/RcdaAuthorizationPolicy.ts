import { RcdaRoles } from "@common/system/RcdaRoles";

export default class RcdaAuthorizationPolicy {

    constructor(requiredRoles?: RcdaRoles[]) {
        this.requiredRoles = requiredRoles || [];
    }

    readonly requiredRoles: RcdaRoles[] = [];
}