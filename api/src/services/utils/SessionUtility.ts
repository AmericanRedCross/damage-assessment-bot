import * as jsonwebtoken from "jsonwebtoken";
import UserSession from "@common/models/resources/UserSession";
import UserModel from "@common/models/resources/UserModel";
import DateUtility from "@/services/utils/DateUtility";
import RcdaAuthorizationPolicy from "@common/system/RcdaAuthorizationPolicy";
import { RcdaRoles } from "@common/system/RcdaRoles";

export default class SessionUtility {
    constructor(private jwt: typeof jsonwebtoken, private dateUtility: DateUtility) {}

    static getInstance() {
        return new SessionUtility(jsonwebtoken, DateUtility.getInstance());
    }

    static jwtSignature = "54376454frwcbyx6c4wgurwj";

    public getUserSession(user: UserModel): UserSession {
        return {
            userId: user.id,
            roles: user.permissions.roles,
            issued: this.dateUtility.currentDateString()
        };
    }

    public getSessionToken(userSession: UserSession): string {
        
        return this.jwt.sign(userSession, SessionUtility.jwtSignature);
    }

    public parseSessionToken(token: string): UserSession {
        try {
           let session = <UserSession>this.jwt.verify(token, SessionUtility.jwtSignature);
           return session;
        }
        catch {
            return null;
        }
    }

    isValidSession(session: UserSession): boolean {
        if (!session || !session.issued) {
            return false;
        }
    
        //TODO refactor date time logic into common utility
        let tokenIssuedDate = this.dateUtility.parseDateString(session.issued);
    
        //TODO put auth logic somewhere else?
        // Sets expiration as 30 days from issue date
        let expirationDate = this.dateUtility.applyDateOffset(tokenIssuedDate, { days: 30 });
    
        return this.dateUtility.currentDate() < expirationDate;
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