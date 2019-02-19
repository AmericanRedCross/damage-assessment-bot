import MyanmarDisasterAssessmentImportService from "@/services/disaster-assessment/MyanmarDisasterAssessmentImportService";
import rcdaHttpFunction from "@/functions/utils/rcdaHttpFunction";
import { HttpStatusCode } from "azure-functions-ts-essentials";
import RcdaHttpHeaders from "@/functions/utils/RcdaHttpHeaders";
import MyanmarDisasterAssessmentReportModel from "@common/models/resources/disaster-assessment/myanmar/MyanmarDisasterAssessmentModel";

class MyanmarDisasterAssessmentImportDependencies {
    constructor(public disasterAssessmentImportService: MyanmarDisasterAssessmentImportService) { }

    static getInstance() {
        return new MyanmarDisasterAssessmentImportDependencies(MyanmarDisasterAssessmentImportService.getInstance());
    }
}

export default rcdaHttpFunction<string|MyanmarDisasterAssessmentReportModel[], void, MyanmarDisasterAssessmentImportDependencies>(
MyanmarDisasterAssessmentImportDependencies.getInstance,
true,
async (req, { disasterAssessmentImportService }, { session }) => {
    
    let contentType = req.headers[RcdaHttpHeaders.ContentType];
    if (contentType === "text/csv") {
        await disasterAssessmentImportService.importCsv(<string>req.body, session.userId);
    }
    else if (contentType === "application/json") {
        await disasterAssessmentImportService.import(<MyanmarDisasterAssessmentReportModel[]>req.body, session.userId);
    }
    else {
        return {
            status: HttpStatusCode.UnsupportedMediaType,
            body: null
        };
    }

    return {
        status: HttpStatusCode.OK,
        body: null
    };
})