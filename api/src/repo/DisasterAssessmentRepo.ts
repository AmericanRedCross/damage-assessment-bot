import RcdaCosmosClient from "@/repo/utils/RcdaCosmosClient";
import DisasterAssessmentModel from "@common/models/resources/disaster-assessment/DisasterAssessmentModel";
import CosmosResourceRepo from "@/repo/utils/CosmosResourceRepo";

export default class DisasterAssessmentRepo extends CosmosResourceRepo<DisasterAssessmentModel<any>> {
    constructor(cosmosClient: RcdaCosmosClient) {
        super(cosmosClient, "DisasterAssessments");
    }

    static getInstance() {
        return new DisasterAssessmentRepo(RcdaCosmosClient.getInstance());
    }
}