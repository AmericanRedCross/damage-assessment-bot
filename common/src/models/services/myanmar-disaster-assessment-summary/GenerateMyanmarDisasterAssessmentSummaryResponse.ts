import { MyanmarSectors } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarSectors";
import { MyanmarSectorFactors } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarSectorFactors";
import { MyanmarDisasterTypes } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarDisasterTypes";
import { MyanmarResponseModalities } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarResponseModalities";
import { MyanmarVulnerableGroups } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarVulnerableGroups";
import { MyanmarAffectedGroups } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarAffectedGroups";

export default interface GenerateMyanmarDisasterAssessmentSummaryResponse {
    count: number;
    startDate: Date;
    endDate: Date;
    location: {
        regionCode: string;
        districtCode: string;
        townshipCode: string;
    };
    disasterType: MyanmarDisasterTypes;
    people: {
        numberBeforeDisaster: number;
        numberLeftArea: number;
        numberReturned: number;
        numberStayedInArea: number;
        numberAffected: number;
        numberDisplaced: number;
        numberNotDisplaced: number;
        numberOfCasualties: number;
    },
    rankings: {
        responseModalities: MyanmarResponseModalities[];
        vulnerableGroups: MyanmarVulnerableGroups[];
        affectedGroups: MyanmarAffectedGroups[];
        prioritySectors: MyanmarSectors[];
    },
    sectors: {
        [sector in MyanmarSectors]: {
            severity: number;
            basicNeedsConcern: number;
            factors: {
                [factor in MyanmarSectorFactors]: number;
            }
        }
    }
}

const x: GenerateMyanmarDisasterAssessmentSummaryResponse = <any>null;
export type  MyanmarDisasterAssessmentSummaryPeople = typeof x.people;