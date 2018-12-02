import DisasterAssessmentUploadService from "@/services/disasterAssessmentUploadService";
import rcdaHttpFunction from "@/functions/utils/rcdaHttpFunction";
import { HttpStatusCode, HttpResponse } from "azure-functions-ts-essentials";

class DisasterAssessmentDependencies {
    constructor(public disasterAssessmentUploadService: DisasterAssessmentUploadService) { }

    static getInstance() {
        return new DisasterAssessmentDependencies(DisasterAssessmentUploadService.getInstance());
    }
}

export default rcdaHttpFunction<DisasterAssessmentUploadService,void,DisasterAssessmentDependencies>(
    DisasterAssessmentDependencies.getInstance,
    true,
    async (req, { disasterAssessmentUploadService }, { session }) => {

        let response = await disasterAssessmentUploadService.uploadDisasterAssessmentReport(req.body);

        return {
            status: HttpStatusCode.OK,
            body: response
        }
})