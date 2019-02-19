import { MyanmarSectors } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarSectors";
import { MyanmarSectorFactors } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarSectorFactors";
import RcdaError, { RcdaErrorTypes } from "@common/system/RcdaError";
import { enumValues, makeObjectWithEnumKeys } from "@common/utils/enumHelpers";
import MyanmarDisasterAssessmentReportModel from "@common/models/resources/disaster-assessment/myanmar/MyanmarDisasterAssessmentModel";
import DisasterAssessmentRepo from "@/repo/DisasterAssessmentRepo";
import { getKeys } from "@common/utils/objectHelpers";
import uuid = require("uuid");
import RcdaCountries from "@common/system/RcdaCountries";
import { MyanmarAffectedGroups } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarAffectedGroups";
import { MyanmarResponseModalities } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarResponseModalities";
import { MyanmarVulnerableGroups } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarVulnerableGroups";
import { MyanmarSectorFactorImpactScale } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarSectorFactorImpactScale";
import RcdaModelValidator, { RcdaModelValidationResult } from "@common/utils/RcdaModelValidator";
import GetMyanmarDisasterAssessmentsRequest from "@common/models/services/myanmar-disaster-assessment/GetMyanmarDisasterAssessmentsRequest";
import { myanmarTownships } from "@common/system/countries/myanmar/MyanmarAdminStack";
import { MyanmarDisasterTypes } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarDisasterTypes";
import { MyanmarGeographicalSettings } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarGeographicalSettings";

const townshipIds = getKeys(myanmarTownships);

export default class MyanmarDisasterAssessmentService {
    
    constructor(private disasterAssessmentRepo: DisasterAssessmentRepo) {}

    public static getInstance() {
        return new MyanmarDisasterAssessmentService(DisasterAssessmentRepo.getInstance());
    }

    public async create(model: MyanmarDisasterAssessmentReportModel, options?: { validate: boolean }): Promise<MyanmarDisasterAssessmentReportModel> {
        model = this.normalizeModel(model);
        options = { 
            validate: true,
            ...options
        };

        if (options.validate) {
            let validationResult = this.validateModel(model);
            if (validationResult.hasErrors) {
                throw new RcdaError(RcdaErrorTypes.ClientError, "One or more validation errors were found", validationResult.errors);
            }
        }

        let township = myanmarTownships[model.location.townshipCode];
        model.location = {
            regionCode: township.regionCode,
            districtCode: township.districtCode,
            townshipCode: township.code
        };

        model.id = uuid();
        model.creationDate = new Date().toJSON();
        model.country = RcdaCountries.Myanmar;

        let result = await this.disasterAssessmentRepo.create(model);

        return this.normalizeModel(result);
    }

    // this prevents callers from passing in an object with arbitrary additional properties and storing them in the repo
    public normalizeModel(model: MyanmarDisasterAssessmentReportModel): MyanmarDisasterAssessmentReportModel {

        let location = model.location || <typeof model.location>{};
        let people = model.people || <typeof model.people>{};
        let rankings = model.rankings || <typeof model.rankings>{};
        let sectors = model.sectors || <typeof model.sectors>{};

        return {
            id: model.id,
            userId: model.userId,
            creationDate: model.creationDate,
            country: model.country,
            location: {
                regionCode: location.regionCode,
                districtCode: location.districtCode,
                townshipCode: location.townshipCode,
            },
            disasterType: model.disasterType,
            geographicalSetting: model.geographicalSetting,
            people: {
                numberBeforeDisaster: people.numberBeforeDisaster,
                numberLeftArea: people.numberLeftArea,
                numberReturned: people.numberReturned,
                numberStayedInArea: people.numberStayedInArea,
                numberAffected: people.numberAffected,
                numberDisplaced: people.numberDisplaced,
                numberNotDisplaced: people.numberNotDisplaced,
                numberOfCasualties: people.numberOfCasualties
            },
            rankings: {
                responseModalities: rankings.responseModalities,
                vulnerableGroups: rankings.vulnerableGroups,
                affectedGroups: rankings.affectedGroups,
                prioritySectors: rankings.prioritySectors
            },
            sectors: makeObjectWithEnumKeys(getKeys(sectors), sectorId => ({
                severity: sectors[sectorId].severity,
                basicNeedsConcern: sectors[sectorId].basicNeedsConcern,
                factors: makeObjectWithEnumKeys(getKeys(sectors[sectorId].factors), factorId => sectors[sectorId].factors[factorId])
            }))
        };
    }

    // currently validates striclty for create scenarios. may need modification to support update
    public validateModel(model: MyanmarDisasterAssessmentReportModel): RcdaModelValidationResult<MyanmarDisasterAssessmentReportModel> {
        let validation = new RcdaModelValidator(model, { mutateModel: true });

        // required fields
        validation.path("userId").mustNotBeEmpty(); //TODO validate userId exists

        // top level
        validation.path("id").mustBeEmpty();
        validation.path("creationDate").mustBeEmpty();
        validation.path("country").mustBeEmpty();
        validation.path("disasterType").mustBeEnumValue(MyanmarDisasterTypes);
        validation.path("geographicalSetting").mustBeEnumValue(MyanmarGeographicalSettings);

        // location
        validation.path("location", "townshipCode").mustNotBeEmpty({ fullPath: true }).mustBeSupportedValue(townshipIds);

        //people
        validation.path("people", "numberBeforeDisaster").mustBeNumber(); // TODO must be greater than 0
        validation.path("people", "numberLeftArea").mustBeNumber();
        validation.path("people", "numberReturned").mustBeNumber();
        validation.path("people", "numberStayedInArea").mustBeNumber();
        validation.path("people", "numberAffected").mustBeNumber();
        validation.path("people", "numberDisplaced").mustBeNumber();
        validation.path("people", "numberNotDisplaced").mustBeNumber();
        validation.path("people", "numberOfCasualties").mustBeNumber();

        // rankings
        let rankingProps: { [x in (keyof (typeof model.rankings))]: any } = {
            "affectedGroups": MyanmarAffectedGroups,
            "prioritySectors": MyanmarSectors,
            "responseModalities": MyanmarResponseModalities,
            "vulnerableGroups": MyanmarVulnerableGroups
        };
        for (let rankingProp of getKeys(rankingProps)) {
            if (model.rankings[rankingProp]) {
                validation.path("rankings", rankingProp).mustBeArray().mustNotExceedMaxLength(3);

                let enumType = rankingProps[rankingProp];
                [0, 1, 2].forEach(index => {
                    validation.path("rankings", rankingProp, index).mustBeEnumValue(enumType);
                });
            }
        }

        // sectors
        validation.path("sectors").mustHaveValidProperties(enumValues(MyanmarSectors));
        //TODO don't use 'has own property', these are not the same as values  
        for (let sectorId of getKeys(model.sectors).filter(key => MyanmarSectors.hasOwnProperty(key))) {

            validation.path("sectors", sectorId, "severity").mustBeNumber();
            validation.path("sectors", sectorId, "basicNeedsConcern").mustBeNumber();
            validation.path("sectors", sectorId, "factors").mustHaveValidProperties(enumValues(MyanmarSectorFactors));
            
            let sectorFactors = model.sectors[sectorId].factors;
            if (sectorFactors) {
                for (let factorId of getKeys(sectorFactors).filter(key => MyanmarSectorFactors.hasOwnProperty(key))) {
                    validation.path("sectors", sectorId, "factors", factorId)
                              .mustBeNumber()
                              .mustBeEnumValue(MyanmarSectorFactorImpactScale);
                }
            }
        }
        
        return validation.getResult();
    }

    public async get(request: GetMyanmarDisasterAssessmentsRequest) {
        return await this.disasterAssessmentRepo.getMyanmarDisasterAssessments(request);
    }
}