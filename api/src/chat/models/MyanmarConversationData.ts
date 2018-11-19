export default class MyanmarConversationData {
    townshipId: string;
    disasterTypeId: string;
    geographicalSettingId: string;
    people = new MyanmarAffectedPeopleSectionInput();
    rankings = new MyanmarRankingSectionInput();
    sectors = new MyanmarSectorsSectionInput();
}

export class MyanmarAffectedPeopleSectionInput {
    numberOfPeopleBeforeDisaster: number;
    numberOfPeopleLeftArea: number;
    numberOfPeopleReturned: number;
    numberOfPeopleLivingCurrently: number;
    totalNumberOfPeopleAffected: number;
    numberOfPeopleDisplaced: number;
    numberOfPeopleNotDisplaced: number;
    numberOfCasualties: number;
}

class MyanmarRankingSectionInput {
    responseModalities: MyanmarRankingInput[] = [];
    vulnerableGroups: MyanmarRankingInput[] = [];
    affectedGroups: MyanmarRankingInput[] = [];
    prioritySectors: MyanmarRankingInput[] = [];
}

class MyanmarRankingInput {
    value: string;
    rank: number;
}

class MyanmarSectorsSectionInput {
    selectedSectorIds: string[] = [];
    completedSectors: MyanmarSectorInput[] = [];
}

class MyanmarSectorInput {
    id: string;
    severity: number;
    factors: MyanmarSectorFactorInput[] = [];
    basicNeedsConcern: number;
}

export class MyanmarSectorFactorInput {
    id: string;
    factorScore: number;
}