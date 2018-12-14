import RcdaError, { RcdaErrorTypes } from "@common/system/RcdaError";
import DisasterAssessmentRepo from "@/repo/DisasterAssessmentRepo";
import GenerateMyanmarDisasterAssessmentSummaryRequest from "@common/models/services/myanmar-disaster-assessment-summary/GenerateMyanmarDisasterAssessmentSummaryRequest";
import GenerateMyanmarDisasterAssessmentSummaryResponse from "@common/models/services/myanmar-disaster-assessment-summary/GenerateMyanmarDisasterAssessmentSummaryResponse";
import { MyanmarSectors } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarSectors";
import { MyanmarSectorFactors } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarSectorFactors";
import { makeObjectWithEnumKeys, enumValues } from "@common/utils/enumHelpers";
import { getKeys } from "@common/utils/objectHelpers";
import { MyanmarAffectedGroups } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarAffectedGroups";
import { MyanmarResponseModalities } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarResponseModalities";
import { MyanmarVulnerableGroups } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarVulnerableGroups";
import { myanmarTownships } from "@common/system/countries/myanmar/MyanmarTownship";
import RcdaModelValidator from "@common/utils/RcdaModelValidator";

export default class MyanmarDisasterAssessmentSummaryService {

    constructor(private disasterAssessmentRepo: DisasterAssessmentRepo) {}

    public static getInstance() {
        return new MyanmarDisasterAssessmentSummaryService(DisasterAssessmentRepo.getInstance());
    }
    
    public async generateSummary(request: GenerateMyanmarDisasterAssessmentSummaryRequest): Promise<GenerateMyanmarDisasterAssessmentSummaryResponse> {
        
        this.validateGenerateSummaryRequest(request);

        console.log(request.startDate);
        console.log(request.endDate);
        
        let items = await this.disasterAssessmentRepo.getMyanmarSummaryItems(request);

        let result = this.getEmptyResponse();

        let { regionCode, districtCode, townshipCode, disasterType, startDate, endDate } = request;

        result.count = items.length;
        result.location = { regionCode, districtCode, townshipCode };
        result.disasterType = disasterType;
        result.startDate = startDate;
        result.endDate = endDate;

        if (result.count === 0) {
            return result;
        }

        let responseModalityRankings = new RankingHelper<MyanmarResponseModalities>(MyanmarResponseModalities);
        let vulnerableGroupRankings  = new RankingHelper<MyanmarVulnerableGroups>(MyanmarVulnerableGroups);
        let affectedGroupRankings = new RankingHelper<MyanmarAffectedGroups>(MyanmarAffectedGroups);
        let prioritySectorRankings = new RankingHelper<MyanmarSectors>(MyanmarSectors);

        for (let report of items) {
            let { people, sectors, rankings } = report;

            if (people) {
                result.people.numberBeforeDisaster += Number(people.numberBeforeDisaster) || 0;
                result.people.numberLeftArea += Number(people.numberLeftArea) || 0;
                result.people.numberReturned += Number(people.numberReturned) || 0;
                result.people.numberStayedInArea += Number(people.numberStayedInArea) || 0;
                result.people.numberAffected += Number(people.numberAffected) || 0;
                result.people.numberDisplaced += Number(people.numberDisplaced) || 0;
                result.people.numberNotDisplaced += Number(people.numberNotDisplaced) || 0;
                result.people.numberOfCasualties += Number(people.numberOfCasualties) || 0;
            }

            if (sectors) {
                for (let sector of getKeys(sectors)) {
                    let resultSector = result.sectors[sector];
                    resultSector.severity += Number(sectors[sector].severity) || 0;
                    resultSector.basicNeedsConcern += Number(sectors[sector].basicNeedsConcern) || 0;
                    for (let factor of getKeys(sectors[sector].factors)) {
                        resultSector.factors[factor] += Number(sectors[sector].factors[factor]) || 0;
                    }
                }
            }

            if (rankings) {
                for (let i = 0; i < 3; i++) {
                    tryAddRanking(responseModalityRankings, rankings.responseModalities, i);
                    tryAddRanking(vulnerableGroupRankings, rankings.vulnerableGroups, i);
                    tryAddRanking(affectedGroupRankings, rankings.affectedGroups, i);
                    tryAddRanking(prioritySectorRankings, rankings.prioritySectors, i);
                }
            }
        }

       // convert severity score sums to averages
        for (let sectorId of getKeys(result.sectors)) {
            let sector = result.sectors[sectorId];

            sector.severity /= result.count;
            sector.basicNeedsConcern /= result.count;

            for (let factorId of getKeys(sector.factors)) {
                sector.factors[factorId] /= result.count;
            }
        }

        // convert ranking scores to sorted list
        result.rankings.responseModalities = responseModalityRankings.sortByRanking();
        result.rankings.vulnerableGroups = vulnerableGroupRankings.sortByRanking();
        result.rankings.affectedGroups = affectedGroupRankings.sortByRanking();
        result.rankings.prioritySectors = prioritySectorRankings.sortByRanking();

        return result;
    }

    private validateGenerateSummaryRequest(request: GenerateMyanmarDisasterAssessmentSummaryRequest) {

        if (!request) {
            throw new RcdaError(RcdaErrorTypes.ClientError, "Request is empty");
        }
        
        if (request.regionCode && !myanmarTownships.find(x => x.regionCode === request.regionCode)) {
            throw new RcdaError(RcdaErrorTypes.ClientError, "Invalid 'regionCode' specified in request");
        }
        
        if (request.districtCode && !myanmarTownships.find(x => x.districtCode === request.districtCode)) {
            throw new RcdaError(RcdaErrorTypes.ClientError, "Invalid 'districtCode' specified in request");
        }
        
        if (request.townshipCode && !myanmarTownships.find(x => x.townshipCode === request.townshipCode)) {
            throw new RcdaError(RcdaErrorTypes.ClientError, "Invalid 'townshipCode' specified in request");
        }
        
        let validation = new RcdaModelValidator(request, { mutateModel: true });

        validation.path("startDate").mustNotBeEmpty().mustBeDate();
        validation.path("endDate").mustNotBeEmpty().mustBeDate();

        let result = validation.getResult();

        if (result.hasErrors) {
            throw new RcdaError(RcdaErrorTypes.ClientError, "The request has validation issues", result.errors);
        }

        return result;
    }

    private getEmptyResponse(): GenerateMyanmarDisasterAssessmentSummaryResponse {
        
        let result: GenerateMyanmarDisasterAssessmentSummaryResponse = {
            count: 0,
            location: null,
            disasterType: null,
            startDate: null,
            endDate: null,
            people: {
                numberBeforeDisaster: 0,
                numberLeftArea: 0,
                numberReturned: 0,
                numberStayedInArea: 0,
                numberAffected: 0,
                numberDisplaced: 0,
                numberNotDisplaced: 0,
                numberOfCasualties: 0
            },
            rankings: {
                responseModalities: [],
                vulnerableGroups: [],
                affectedGroups: [],
                prioritySectors: []
            },
            sectors: makeObjectWithEnumKeys(enumValues<MyanmarSectors>(MyanmarSectors), () => ({
                severity: 0,
                basicNeedsConcern: 0,
                factors: makeObjectWithEnumKeys(enumValues<MyanmarSectorFactors>(MyanmarSectorFactors), () => 0)
            }))
        };

        return result;
    }
}

class RankingHelper<TEnum extends string|number> {
    constructor(rankedType: any) {
        this.rankItems = enumValues<TEnum>(rankedType);
        this.rankScores = makeObjectWithEnumKeys(this.rankItems, () => 0);
    }

    private rankItems: TEnum[];
    private rankScores: { [x in TEnum]: number };

    public addRanking(value: TEnum, zeroIndexedRank: number) {
        if (value) {
            let rankingScore = 1 - (zeroIndexedRank / 3);
            this.rankScores[<any>value] += rankingScore;
        }
    }

    public sortByRanking(): TEnum[] {
        return this.rankItems.filter(x => this.rankScores[<any>x] !== 0)
                             .sort((a, b) => this.rankScores[<any>a] - this.rankScores[<any>b]);
    }
}

function tryAddRanking(rankingHelper: any, data: any, index: number) {
    if (data) {
        rankingHelper.addRanking(data[index], index);
    }
    
}