import DisasterAssessmentModel from "@common/models/resources/disaster-assessment/DisasterAssessmentModel";
import { MyanmarSectors } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarSectors";
import { MyanmarSectorFactors } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarSectorFactors";
import { MyanmarSectorFactorImpactScale } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarSectorFactorImpactScale";
import { MyanmarDisasterTypes } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarDisasterTypes";
import { MyanmarGeographicalSettings } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarGeographicalSettings";
import { MyanmarResponseModalities } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarResponseModalities";
import { MyanmarVulnerableGroups } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarVulnerableGroups";
import { MyanmarAffectedGroups } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarAffectedGroups";
import { MyanmarSectorSeverityScale } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarSectorSeverityScale";

export default interface MyanmarDisasterAssessmentReportModel extends DisasterAssessmentModel {
    location: MyanmarLocation;
    disasterType: MyanmarDisasterTypes;
    geographicalSetting: MyanmarGeographicalSettings;
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
            severity: MyanmarSectorSeverityScale;
            basicNeedsConcern: number;
            factors: {
                [factor in MyanmarSectorFactors]: MyanmarSectorFactorImpactScale;
            }
        }
    }
}

export interface MyanmarLocation {
    regionCode: string;
    districtCode: string;
    townshipCode: string;
}