import * as jsonwebtoken from "jsonwebtoken";
import UserSession from "@common/models/resources/UserSession";
import UserModel from "@common/models/resources/UserModel";
import DateUtility from "@/services/utils/DateUtility";
import RcdaAuthorizationPolicy from "@common/system/RcdaAuthorizationPolicy";

export interface SessionUtilityOptions {
    jwtSignature: string,
    sessionDuration: number|string
}

export default class SessionUtility {
    constructor(
        private jwt: typeof jsonwebtoken, 
        private dateUtility: DateUtility,
        private options: SessionUtilityOptions) {
            this.options = Object.assign({}, options);
        }

    static getInstance() {
        return new SessionUtility(jsonwebtoken, DateUtility.getInstance(), {
            jwtSignature: process.env["JsonWebTokenSignature"],
            sessionDuration: "45m"
         });
    }

    public getSessionTokenForUser(user: UserModel) {
        let session: UserSession = {
            userId: user.id,
            roles: user.permissions.roles,
            iat: undefined,
            exp: undefined
        };

        return this.getSessionToken(session);
    }

    public getSessionToken(userSession: UserSession): string {
        let sessionCopy = Object.assign({}, userSession);
        
        delete sessionCopy.iat;
        delete sessionCopy.exp;

        let token = this.jwt.sign(sessionCopy, this.options.jwtSignature, { 
            algorithm: "HS512",
            expiresIn: this.options.sessionDuration
        });
        return token;
    }

    public getValidSession(token: string): UserSession {
        try {
           let session = <UserSession>this.jwt.verify(token, this.options.jwtSignature);
           return session;
        }
        catch {
            return null;
        }
    }
    
    isAuthorized(session: UserSession, authPolicy: RcdaAuthorizationPolicy|null): boolean {
        if (authPolicy === null) {
            return true;
        }

        if (authPolicy.requiredRoles.length > 0 && !session || !session.roles) {
            return false;
        }
    
        // verifies that the user has every required role, or else returns false
        return authPolicy.requiredRoles.every(role => session.roles.includes(role));
    }
}