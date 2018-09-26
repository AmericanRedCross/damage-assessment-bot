import SessionUtility from "@/services/utils/SessionUtility";
import DateUtility from "@/services/utils/DateUtility";
import * as jsonwebtoken from "jsonwebtoken";

export default class TestSessionUtility extends SessionUtility {
    constructor(sessionDuration: string = "5m") {
        super(jsonwebtoken, new DateUtility(), { 
            jwtSignature: "fakesignature", 
            sessionDuration
        })
    }
}