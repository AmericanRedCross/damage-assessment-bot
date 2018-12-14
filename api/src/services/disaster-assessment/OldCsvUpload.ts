import fast_csv = require("fast-csv");
import MyanmarConversationData, { MyanmarSectorFactorInput, MyanmarAffectedPeopleSectionInput } from "@/chat/models/MyanmarConversationData"
import { MyanmarDisasterTypes } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarDisasterTypes";
import { MyanmarGeographicalSettings } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarGeographicalSettings";
import { myanmarTownships, MyanmarTownship } from "@common/system/countries/myanmar/MyanmarTownship";
import { MyanmarSectorSeverityScale } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarSectorSeverityScale";
import { MyanmarSectors } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarSectors";
import { MyanmarSectorFactors } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarSectorFactors";
import { MyanmarSectorFactorImpactScale } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarSectorFactorImpactScale";
import { MyanmarSectorBasicNeedsConcernScale } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarSectorBasicNeedsConcernScale";
import { MyanmarAffectedGroups } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarAffectedGroups";
import { MyanmarVulnerableGroups } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarVulnerableGroups";
import { MyanmarResponseModalities } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarResponseModalities";
import RcdaError, { RcdaErrorTypes } from "@common/system/RcdaError";
import { IsNumeric } from "@common/utils/isNumeric";

interface IErrorLog {
    row?: number,
    errorMessages: Array<string>|string
}

export default class DisasterAssessmentUploadService {
    
    constructor() {
    }

    public static getInstance() {
        return new DisasterAssessmentUploadService();
    }

    
    private numberOfTopAffectedGroups:number = 3;
    private numberOfTopPrioritySectors:number = 3;
    private numberOfTopVulnerableGroups:number = 3;
    private numberOfTopResponseModalities:number = 3;

    public async uploadDisasterAssessmentReport(data:any): Promise<void> {
        
        let rowNumber = 0;
        let errorLog:IErrorLog[] = [];
        
        let _this = this;

        return new Promise<void>(function(resolve, reject) {
            console.log("!!!!!!!!!!!")
            if (!data) {
                reject(new RcdaError(RcdaErrorTypes.ClientError, "Request content is empty"));
            }
            fast_csv.fromString(data, {
                objectMode:true,
                headers:true,
                trim:true,
        
            }).validate((data:any):boolean => {
                console.log("!!!!!!!!!!!validate")
                try {
                    
                    if (!data) {
                        return false;
                    }
                    
                    let validationErrorLog:Array<string> = [];
                    rowNumber++;
                    if (rowNumber === 1) {
                        _this.validateHeaders(data,validationErrorLog);
                    }
                    
                    _this.validateUserInfo(data,validationErrorLog);
                    _this.validateAffectedPeople(data,validationErrorLog);
                    _this.validateSectorSeverity(data,validationErrorLog);
                    _this.validateSectorFactorData(data,validationErrorLog);
                    _this.validateSectorBasicNeedsConcern(data,validationErrorLog);
                    _this.validateTopAffectedGroups(data,validationErrorLog);
                    _this.validateTopPrioritySectors(data,validationErrorLog);
                    _this.validateTopVulnerableGroups(data,validationErrorLog);
                    _this.validateTopResponseModalities(data,validationErrorLog);
                    if (validationErrorLog.length === 0) {
                        return true;
                    } else {
                        errorLog.push(
                            {
                                row: rowNumber,
                                errorMessages: validationErrorLog
                            }
                        );
                        return false;
                    }
                }
                catch (error) {
                    reject(error);
                    throw error;
                }
            }).on("data",function (data:any):void {
                
                console.log("!!!!!!!!!!!data")
                // TODO Save the report in cosmos
                
            }).on("end",():void => {
                console.log("!!!!!!!!!!!end")
                let csvUploadResponse:object = {};
                if (rowNumber === 0) {
                    errorLog.push({
                        errorMessages: `No rows were parsed. Are you sure the data is Comma Separated?`
                    });
                }
                resolve();
            }).on("error",function (error:any) {
                console.log("!!!!!!!!!!!error")
                errorLog.push(
                    {
                        errorMessages: error.toString()
                    }
                );
                reject(error);
            })

            if (errorLog.length !== 0) {
                reject(new RcdaError(RcdaErrorTypes.ClientError, "There were various errors. Please review them below - ", this.errorLog));
            }
            
            console.log("!!!!!!!!!!!sync-end")
        });
    }

    private validateHeaders(data:object,errorLog:Array<string>):void {
        const csvProperties = Object.getOwnPropertyNames(data);
        
        for (const header of this.getCsvHeaders()) {
            if (!csvProperties.includes(header)) {
                errorLog.push(`CSV header was not recognized: '${header}'`);
            }
        }
    }

    private validateUserInfo(data:any,errorLog:Array<string>):void {
        const townshipMatch:boolean = myanmarTownships.some( (element:MyanmarTownship) => {
            return element.townshipCode === data.townshipId;
        });
    
        if (!townshipMatch) {
            errorLog.push(`Could not find township [${data.townshipId}]`);
        }
    
        if (!Object.values(MyanmarDisasterTypes).includes(data.disasterTypeId)) {
            errorLog.push(`Did not find the Disaster Type ID [${data.disasterTypeId}]`);
        }
        
        if (!Object.values(MyanmarGeographicalSettings).includes(data.geographicalSettingId)) {
            errorLog.push(`The Geographical Setting is not valid [${data.geographicalSettingId}]`)
        }
    }

    private validateAffectedPeople(data:object,errorLog:Array<string>):void {
        let affectedPeopleArray:Array<string> = new Array(
            "numberOfPeopleBeforeDisaster",
            "numberOfPeopleLeftArea",
            "numberOfPeopleReturned",
            "numberOfPeopleLivingCurrently",
            "totalNumberOfPeopleAffected",
            "numberOfPeopleDisplaced",
            "numberOfPeopleNotDisplaced",
            "numberOfCasualties",
        );
        affectedPeopleArray.map((element:string) => {
            if (!IsNumeric(data[element])) {
                errorLog.push(`[${element}] needs to be a number!`)
            }
        });
    }

    private validateSectorSeverity(data:object,errorLog:Array<string>):void {
    
        let sectorSeverityHeaders:Array<string> = new Array(
            "sectorHealthSeverity",
            "sectorFoodSeverity",
            "sectorWashSeverity",
            "sectorShelterNFISeverity",
            "sectorProtectionSeverity",
            "sectorEducationSeverity",
            "sectorLivelihoodSeverity",
            "sectorOtherSeverity"
        );
    
        sectorSeverityHeaders.forEach((header:string) => {
            if (IsNumeric(data[header])) {
                if (!Object.values(MyanmarSectorSeverityScale).includes(parseInt(data[header]))) {
                    errorLog.push(`The value for header [${header}] is not within range.`);
                }
            } else {
                errorLog.push(`The value for header [${header}] is not a number.`);
                
            }
        });
    }

    private validateSectorFactorData(data:object,errorLog:Array<string>):void {
        Object.values(MyanmarSectors).forEach((sector)=> {
            Object.values(MyanmarSectorFactors).forEach( (factor) => {
                const sectorFactorScore:string = data[`sector${sector}${factor}`];
                if (IsNumeric(sectorFactorScore)) {
                    if (!Object.values(MyanmarSectorFactorImpactScale).includes(parseInt(sectorFactorScore))) {
                        errorLog.push(`The value for sector [${sector}] and factor [${factor}] is not in range.`);
                    }
                } else {
                    errorLog.push(`The value for sector [${sector}] and factor [${factor}] is not a number`);
                }
            });
        });
    }

    private validateSectorBasicNeedsConcern(data:object,errorLog:Array<string>):void {
        Object.values(MyanmarSectors).forEach((sector) => {
            const sectorBasicNeedsConcern:string = data[`sector${sector}FutureConcern`];
            if (IsNumeric(sectorBasicNeedsConcern)) {
                if (!Object.values(MyanmarSectorBasicNeedsConcernScale).includes(parseInt(sectorBasicNeedsConcern))) {
                    errorLog.push(`The Future Concern for sector [${sector}] is not in range.`);
                }
            } else {
                errorLog.push(`The Future Concern for sector [${sector}] is not a number`);
            }
        });
    }

    private validateTopAffectedGroups(data:object,errorLog:Array<string>):void {
        for (let index = 1; index <= this.numberOfTopAffectedGroups; index++) {
            const affectedGroup:string = data[`topAffectedGroup${index}`];
            if (!Object.values(MyanmarAffectedGroups).includes(affectedGroup)) {
                errorLog.push(`The value for header [topAffectedGroup${index}] was not recognized.`);
            }
        }
    }

    private validateTopPrioritySectors(data:object,errorLog:Array<string>):void {
        for (let index = 1; index <= this.numberOfTopPrioritySectors; index++) {
            const affectedGroup:string = data[`topPrioritySector${index}`];
            if (!Object.values(MyanmarSectors).includes(affectedGroup)) {
                errorLog.push(`The value for header [topPrioritySector${index}] was not recognized.`);
            }
        }
    }

    private validateTopVulnerableGroups(data:object,errorLog:Array<string>):void {
        for (let index = 1; index <= this.numberOfTopVulnerableGroups; index++) {
            const affectedGroup:string = data[`topVulnerableGroup${index}`];
            if (!Object.values(MyanmarVulnerableGroups).includes(affectedGroup)) {
                errorLog.push(`The value for header [topVulnerableGroup${index}] was not recognized.`);
            }
        }
    }

    private validateTopResponseModalities(data:object,errorLog:Array<string>):void {
        for (let index = 1; index <= this.numberOfTopResponseModalities; index++) {
            const affectedGroup:string = data[`topResponseModality${index}`];
            if (!Object.values(MyanmarResponseModalities).includes(affectedGroup)) {
                errorLog.push(`The value for header [topResponseModality${index}] was not recognized.`);
            }
        }
    }

    private createReport(data:any):MyanmarConversationData {
        const reportData = new MyanmarConversationData();
        
    
        reportData.townshipId = data.townshipId;
        reportData.disasterTypeId = data.disasterTypeId;
        reportData.geographicalSettingId = data.geographicalSettingId;
    
        reportData.people.numberOfCasualties = data.numberOfCasualties;
        reportData.people.numberOfPeopleBeforeDisaster = data.numberOfPeopleBeforeDisaster;
        reportData.people.numberOfPeopleDisplaced = data.numberOfPeopleDisplaced;
        reportData.people.numberOfPeopleLeftArea = data.numberOfPeopleLeftArea;
        reportData.people.numberOfPeopleLivingCurrently = data.numberOfPeopleLivingCurrently;
        reportData.people.numberOfPeopleNotDisplaced = data.numberOfPeopleNotDisplaced;
        reportData.people.numberOfPeopleReturned = data.numberOfPeopleReturned;
        reportData.people.numberOfPeopleAffected = data.numberOfPeopleAffected;
    
        // Get Values for Top Affected Groups
        for (let index = 1; index <= this.numberOfTopAffectedGroups; index++) {
            reportData.rankings.affectedGroups.push(
                {
                    rank: index,
                    value: data[`topAffectedGroup${index}`]
                }
            );
        }
    
        // Get Values for Top Priority Sectors
        for (let index = 1; index <= this.numberOfTopPrioritySectors; index++) {
            reportData.rankings.prioritySectors.push(
                {
                    rank: index,
                    value: data[`topPrioritySector${index}`]
                }
            );
        }
        
        // Get Values for Top Vulnerable Groups
        for (let index = 1; index <= this.numberOfTopVulnerableGroups; index++) {
            reportData.rankings.vulnerableGroups.push(
                {
                    rank: index,
                    value: data[`topVulnerableGroup${index}`]
                }
            );
            
        }
    
        // Get Values for Top Response Modalities
        for (let index = 1; index <= this.numberOfTopResponseModalities; index++) {
            reportData.rankings.responseModalities.push(
                {
                    rank: index,
                    value: data[`topResponseModality${index}`]
                }
            );
        }
    
        Object.values(MyanmarSectors).forEach( (sector:MyanmarSectors) => {
            const sectorSeverity = data["sector" + sector + "Severity"];
            const sectorbasicNeedsConcern = data["sector" + sector + "FutureConcern"];
            let sectorFactorsArray:MyanmarSectorFactorInput[] = [];
    
            Object.values(MyanmarSectorFactors).forEach( (sectorFactor:MyanmarSectorFactors) => {
                sectorFactorsArray.push({
                    id: sectorFactor,
                    factorScore: data[`sector${sector}${sectorFactor}`]
                });
            });
    
            reportData.sectors.completedSectors.push(
                {
                    id: sector,
                    factors: sectorFactorsArray,
                    severity: sectorSeverity,
                    basicNeedsConcern: sectorbasicNeedsConcern
                }
            );
        });
    
        return reportData;
    }

    public getCsvTemplate(): string {
        return this.getCsvHeaders().join(",");
    }

    public getCsvHeaders(): string[] {
        return [
            "townshipId",
            "disasterTypeId",
            "geographicalSettingId",
            "numberOfPeopleBeforeDisaster",
            "numberOfPeopleLeftArea",
            "numberOfPeopleReturned",
            "numberOfPeopleLivingCurrently",
            "totalNumberOfPeopleAffected",
            "numberOfPeopleDisplaced",
            "numberOfPeopleNotDisplaced",
            "numberOfCasualties",
            "sectorHealthSeverity",
            "sectorHealthAccess",
            "sectorHealthAvailability",
            "sectorHealthQuality",
            "sectorHealthUse",
            "sectorHealthFutureConcern",
            "sectorFoodSeverity",
            "sectorFoodAccess",
            "sectorFoodAvailability",
            "sectorFoodQuality",
            "sectorFoodUse",
            "sectorFoodFutureConcern",
            "sectorWashSeverity",
            "sectorWashAccess",
            "sectorWashAvailability",
            "sectorWashQuality",
            "sectorWashUse",
            "sectorWashFutureConcern",
            "sectorShelterNFISeverity",
            "sectorShelterNFIAccess",
            "sectorShelterNFIAvailability",
            "sectorShelterNFIQuality",
            "sectorShelterNFIUse",
            "sectorShelterNFIFutureConcern",
            "sectorProtectionSeverity",
            "sectorProtectionAccess",
            "sectorProtectionAvailability",
            "sectorProtectionQuality",
            "sectorProtectionUse",
            "sectorProtectionFutureConcern",
            "sectorEducationSeverity",
            "sectorEducationAccess",
            "sectorEducationAvailability",
            "sectorEducationQuality",
            "sectorEducationUse",
            "sectorEducationFutureConcern",
            "sectorLivelihoodSeverity",
            "sectorLivelihoodAccess",
            "sectorLivelihoodAvailability",
            "sectorLivelihoodQuality",
            "sectorLivelihoodUse",
            "sectorLivelihoodFutureConcern",
            "sectorOtherSeverity",
            "sectorOtherAccess",
            "sectorOtherAvailability",
            "sectorOtherQuality",
            "sectorOtherUse",
            "sectorOtherFutureConcern",
            "topAffectedGroup1",
            "topAffectedGroup2",
            "topAffectedGroup3",
            "topPrioritySector1",
            "topPrioritySector2",
            "topPrioritySector3",
            "topVulnerableGroup1",
            "topVulnerableGroup2",
            "topVulnerableGroup3",
            "topResponseModality1",
            "topResponseModality2",
            "topResponseModality3"
        ];
    }
}