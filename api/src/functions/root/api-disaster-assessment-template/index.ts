import DisasterAssessmentTemplateService from "@/services/DisasterAssessmentTemplateService";
import rcdaHttpFunction from "@/functions/utils/rcdaHttpFunction";
import { RcdaHttpResponse, RcdaHttpFunction } from "@/functions/utils/rcda-http-types";


class DisasterAssessmentTemplateDependencies {
    constructor(public disasterAssessmentTemplateService: DisasterAssessmentTemplateService) { }

    static getInstance() {
        return new DisasterAssessmentTemplateDependencies(DisasterAssessmentTemplateService.getInstance());
    }
}

export default rcdaHttpFunction<DisasterAssessmentTemplateService,string,DisasterAssessmentTemplateDependencies>(
    DisasterAssessmentTemplateDependencies.getInstance,
    true,
    async (req, { disasterAssessmentTemplateService }, session) => {

        let csvTemplateResponse:RcdaHttpResponse<string> = await disasterAssessmentTemplateService.getCsvTemplate();
        
        return csvTemplateResponse;
})