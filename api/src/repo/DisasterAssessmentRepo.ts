import RcdaCosmosClient from "@/repo/utils/RcdaCosmosClient";
import modelProp from "@/repo/utils/modelProp";
import MyanmarDisasterAssessmentModel, { MyanmarLocation } from "@common/models/resources/disaster-assessment/myanmar/MyanmarDisasterAssessmentModel";
import GenerateMyanmarDisasterAssessmentSummaryRequest from "@common/models/services/myanmar-disaster-assessment-summary/GenerateMyanmarDisasterAssessmentSummaryRequest";
import CosmosResourceRepo from "./utils/CosmosResourceRepo";

export default class DisasterAssessmentRepo extends CosmosResourceRepo<MyanmarDisasterAssessmentModel> {
    constructor(cosmosClient: RcdaCosmosClient) {
        super(cosmosClient, "DisasterAssessments");
    }

    static getInstance() {
        return new DisasterAssessmentRepo(RcdaCosmosClient.getInstance());
    }

    private readonly locationProp = modelProp<MyanmarDisasterAssessmentModel>("location");

    public getMyanmarDisasterAssessments(query: GenerateMyanmarDisasterAssessmentSummaryRequest): Promise<MyanmarDisasterAssessmentModel[]> {
        let filters: string[] = [];
        if (query.regionCode) {
            filters.push(`c.${this.locationProp}.${modelProp<MyanmarLocation>("regionCode")} = @regionCode`)
        }
        if (query.districtCode) {
            filters.push(`c.${this.locationProp}.${modelProp<MyanmarLocation>("districtCode")} = @districtCode`)
        }
        if (query.townshipCode) {
            filters.push(`c.${this.locationProp}.${modelProp<MyanmarLocation>("townshipCode")} = @townshipCode`)
        }

        if (query.disasterType) {
            filters.push(`c.${modelProp<MyanmarDisasterAssessmentModel>("disasterType")} = @disasterType`)
        }

        filters.push(`c.${modelProp<MyanmarDisasterAssessmentModel>("creationDate")} >= @startDate`);
        filters.push(`c.${modelProp<MyanmarDisasterAssessmentModel>("creationDate")} <= @endDate`);
        
        let filterQuery = `SELECT * FROM ROOT c WHERE ${filters.join(" AND ")}`;

        return this.query(filterQuery, {
            regionCode: query.regionCode,
            districtCode: query.districtCode,
            townshipCode: query.townshipCode,
            disasterType: query.disasterType,
            startDate: query.startDate.toJSON(),
            endDate: query.endDate.toJSON()
        });
    }
}