import MyanmarDisasterAssessmentService from "@/services/disaster-assessment/MyanmarDisasterAssessmentService";
import rcdaHttpFunction from "@/functions/utils/rcdaHttpFunction";
import { HttpStatusCode, HttpMethod } from "azure-functions-ts-essentials";
import RcdaHttpHeaders from "@/functions/utils/RcdaHttpHeaders";
import MyanmarDisasterAssessmentReportModel from "@common/models/resources/disaster-assessment/myanmar/MyanmarDisasterAssessmentModel";
import GetMyanmarDisasterAssessmentsRequest from "@common/models/services/myanmar-disaster-assessment/GetMyanmarDisasterAssessmentsRequest";

class MyanmarDisasterAssessmentDependencies {
    constructor(public disasterAssessmentService: MyanmarDisasterAssessmentService) { }

    static getInstance() {
        return new MyanmarDisasterAssessmentDependencies(MyanmarDisasterAssessmentService.getInstance());
    }
}

export default rcdaHttpFunction<string|MyanmarDisasterAssessmentReportModel, null|MyanmarDisasterAssessmentReportModel[]|string, MyanmarDisasterAssessmentDependencies>(
MyanmarDisasterAssessmentDependencies.getInstance,
true,
async (req, { disasterAssessmentService }) => {
    
    if (req.method === HttpMethod.Post) {
        await disasterAssessmentService.create(<MyanmarDisasterAssessmentReportModel>req.body);
        
        return {
            status: HttpStatusCode.OK,
            body: null
        };
    }

    if (req.method === HttpMethod.Get) {
        let result = await disasterAssessmentService.get({            
            regionCode: req.query["regionCode"],
            districtCode: req.query["districtCode"],
            townshipCode: req.query["townshipCode"],
            disasterType: req.query["disasterType"],
            startDate: req.query["startDate"] && new Date(req.query["startDate"]),
            endDate: req.query["endDate"] && new Date(req.query["endDate"]) 
        });
        
        return {
            status: HttpStatusCode.OK,
            body: result
        };
    }

    // no hits, method must not have been supported
    return {
        status: HttpStatusCode.MethodNotAllowed,
        body: null
    };
})