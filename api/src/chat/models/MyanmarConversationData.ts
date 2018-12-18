import { MyanmarSectors } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarSectors";
import { MyanmarSectorFactors } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarSectorFactors";
import { MyanmarSectorFactorImpactScale } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarSectorFactorImpactScale";
import { MyanmarDisasterTypes } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarDisasterTypes";
import { MyanmarGeographicalSettings } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarGeographicalSettings";
import { MyanmarResponseModalities } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarResponseModalities";
import { MyanmarVulnerableGroups } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarVulnerableGroups";
import { MyanmarAffectedGroups } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarAffectedGroups";
import { MyanmarSectorSeverityScale } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarSectorSeverityScale";

export default class MyanmarConversationData {
    townshipId: string;
    disasterTypeId: MyanmarDisasterTypes;
    geographicalSettingId: MyanmarGeographicalSettings;
    people = new MyanmarAffectedPeopleSectionInput();
    rankings = new MyanmarRankingSectionInput();
    sectors = new MyanmarSectorsSectionInput();
}

export class MyanmarAffectedPeopleSectionInput {
    numberOfPeopleBeforeDisaster: number;
    numberOfPeopleLeftArea: number;
    numberOfPeopleReturned: number;
    numberOfPeopleLivingCurrently: number;
    numberOfPeopleAffected: number;
    numberOfPeopleDisplaced: number;
    numberOfPeopleNotDisplaced: number;
    numberOfCasualties: number;
}

export class MyanmarRankingSectionInput {
    responseModalities: MyanmarRankingInput<MyanmarResponseModalities>[] = [];
    vulnerableGroups: MyanmarRankingInput<MyanmarVulnerableGroups>[] = [];
    affectedGroups: MyanmarRankingInput<MyanmarAffectedGroups>[] = [];
    prioritySectors: MyanmarRankingInput<MyanmarSectors>[] = [];
}

export class MyanmarRankingInput<TValue> {
    value: TValue;
    rank: number;
}

export class MyanmarSectorsSectionInput {
    selectedSectorIds: MyanmarSectors[] = [];
    completedSectors: MyanmarSectorInput[] = [];
}

export class MyanmarSectorInput {
    id: MyanmarSectors;
    severity: MyanmarSectorSeverityScale;
    factors: MyanmarSectorFactorInput[] = [];
    basicNeedsConcern: number;
}

export class MyanmarSectorFactorInput {
    id: MyanmarSectorFactors;
    factorScore: MyanmarSectorFactorImpactScale;
}
