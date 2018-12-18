import MyanmarDisasterAssessmentImportService from "@/services/disaster-assessment/MyanmarDisasterAssessmentImportService";
import rcdaHttpFunction from "@/functions/utils/rcdaHttpFunction";
import { HttpStatusCode } from "azure-functions-ts-essentials";
import RcdaHttpHeaders from "@/functions/utils/RcdaHttpHeaders";

class DisasterAssessmentImportTemplateDependencies {
    constructor(public importService: MyanmarDisasterAssessmentImportService) { }

    static getInstance() {
        return new DisasterAssessmentImportTemplateDependencies(MyanmarDisasterAssessmentImportService.getInstance());
    }
}

export default rcdaHttpFunction<void, string, DisasterAssessmentImportTemplateDependencies>(
DisasterAssessmentImportTemplateDependencies.getInstance,
true,
async (req, { importService }) => {

    let template = await importService.getCsvTemplate();
    
    return {
        status: HttpStatusCode.OK,
        body: template,
        headers: {
            [RcdaHttpHeaders.ContentType]: "text/csv",
            [RcdaHttpHeaders.ContentDisposition]: "attachment; filename=RcdaMyanmarDisasterAssessmentsTemplate.csv"
        }
    };
})