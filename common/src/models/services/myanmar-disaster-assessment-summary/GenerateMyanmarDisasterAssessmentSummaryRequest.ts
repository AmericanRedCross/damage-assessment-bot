import { MyanmarDisasterTypes } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarDisasterTypes";

export default interface GenerateMyanmarDisasterAssessmentSummaryRequest {
    regionCode: string;
    districtCode: string;
    townshipCode: string;
    disasterType: MyanmarDisasterTypes;
    startDate: Date;
    endDate: Date;
}