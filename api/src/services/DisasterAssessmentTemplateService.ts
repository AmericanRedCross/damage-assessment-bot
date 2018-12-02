import { rcdaCsvHeaders } from "./utils/RcdaCsvHeaders";
import { RcdaHttpResponse } from "@/functions/utils/rcda-http-types";
import { HttpStatusCode } from "azure-functions-ts-essentials";

export default class DisasterAssessmentTemplateService {
    constructor() {}

    static getInstance() {
        return new DisasterAssessmentTemplateService();
    }

    public async getCsvTemplate():Promise<RcdaHttpResponse<string>> {

        return {
            status: HttpStatusCode.OK,
            body: rcdaCsvHeaders.join(","),
            headers: {
                "Content-Type": "text/csv",
                "Content-Disposition": "attachment; filename=RCDA Damage Assessment CSV"
            }
        }
    }
}