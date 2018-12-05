import { HttpStatusCode } from "azure-functions-ts-essentials";
import rcdaHttpFunction from "@/functions/utils/rcdaHttpFunction";
import MyanmarDisasterAssessmentSummaryService from "@/services/disaster-assessment/MyanmarDisasterAssessmentSummaryService";
import GenerateMyanmarDisasterAssessmentSummaryRequest from "@common/models/services/myanmar-disaster-assessment-summary/GenerateMyanmarDisasterAssessmentSummaryRequest";
import GenerateMyanmarDisasterAssessmentSummaryResponse from "@common/models/services/myanmar-disaster-assessment-summary/GenerateMyanmarDisasterAssessmentSummaryResponse";

class MyanmarDisasterAssessmentSummaryDependencies {

  constructor(public disasterAssessmentService: MyanmarDisasterAssessmentSummaryService) { }

  static getInstance() {
    return new MyanmarDisasterAssessmentSummaryDependencies(MyanmarDisasterAssessmentSummaryService.getInstance());
  }
}

export default rcdaHttpFunction<GenerateMyanmarDisasterAssessmentSummaryRequest, GenerateMyanmarDisasterAssessmentSummaryResponse, MyanmarDisasterAssessmentSummaryDependencies>(
MyanmarDisasterAssessmentSummaryDependencies.getInstance,
true,
async (req, { disasterAssessmentService }) => {

  let result = await disasterAssessmentService.generateSummary(req.body);

  return {
    status: HttpStatusCode.OK,
    body: result
  };
});