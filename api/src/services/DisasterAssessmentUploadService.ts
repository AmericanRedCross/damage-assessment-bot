import fast_csv = require("fast-csv");
import { rcdaCsvHeaders } from "@/services/utils/RcdaCsvHeaders";
import MyanmarConversationData, { MyanmarSectorFactorInput, MyanmarAffectedPeopleSectionInput } from "@/chat/models/MyanmarConversationData"
import { MyanmarDisasterTypes } from "@common/models/resources/disaster-assessment/enums/MyanmarDisasterTypes";
import { MyanmarGeographicalSettings } from "@common/models/resources/disaster-assessment/enums/MyanmarGeographicalSettings";
import { myanmarTownships, MyanmarTownship } from "@common/system/countries/myanmar/MyanmarTownship";
import { MyanmarSectorSeverityScale } from "@common/models/resources/disaster-assessment/enums/MyanmarSectorSeverityScale";
import { MyanmarSectors } from "@common/models/resources/disaster-assessment/enums/MyanmarSectors";
import { MyanmarSectorFactors } from "@common/models/resources/disaster-assessment/enums/MyanmarSectorFactors";
import { MyanmarSectorFactorImpactScale } from "@common/models/resources/disaster-assessment/enums/MyanmarSectorFactorImpactScale";
import { MyanmarSectorBasicNeedsConcernScale } from "@common/models/resources/disaster-assessment/enums/MyanmarSectorBasicNeedsConcernScale";
import { MyanmarAffectedGroups } from "@common/models/resources/disaster-assessment/enums/MyanmarAffectedGroups";
import { MyanmarVulnerableGroups } from "@common/models/resources/disaster-assessment/enums/MyanmarVulnerableGroups";
import { MyanmarResponseModalities } from "@common/models/resources/disaster-assessment/enums/MyanmarResponseModalities";
import RcdaError, { RcdaErrorTypes } from "@common/system/RcdaError";
import { IsNumeric } from "@common/utils/isNumeric";

interface IErrorLog {
    row?: number,
    errorMessages: Array<string>|string
}

export default class DisasterAssessmentUploadService {
    
    public numberOfTopAffectedGroups:number = 3;
    public numberOfTopPrioritySectors:number = 3;
    public numberOfTopVulnerableGroups:number = 3;
    public numberOfTopResponseModalities:number = 3;

    private rowNumber:number;
    private errorLog:IErrorLog[];

    constructor() {
        this.rowNumber = 0;
        this.errorLog = [];
    }

    public static getInstance() {
        return new DisasterAssessmentUploadService();
    }

    public async uploadDisasterAssessmentReport(data:any):Promise<void> {

        if (!data) {
            throw new RcdaError(RcdaErrorTypes.ClientError, "Request received is empty");
        }
        fast_csv.fromString(data, {
            objectMode:true,
            headers:true,
            trim:true,
    
        }).validate((data:any):boolean => {
            if (!data) {
                return false;
            }
            
            let validationErrorLog:Array<string> = [];
            this.rowNumber++;
            if (this.rowNumber === 1) {
                this.validateHeaders(data,validationErrorLog);
            }
            
            this.validateUserInfo(data,validationErrorLog);
            this.validateAffectedPeople(data,validationErrorLog);
            this.validateSectorSeverity(data,validationErrorLog);
            this.validateSectorFactorData(data,validationErrorLog);
            this.validateSectorBasicNeedsConcern(data,validationErrorLog);
            this.validateTopAffectedGroups(data,validationErrorLog);
            this.validateTopPrioritySectors(data,validationErrorLog);
            this.validateTopVulnerableGroups(data,validationErrorLog);
            this.validateTopResponseModalities(data,validationErrorLog);
            if (validationErrorLog.length === 0) {
                return true;
            } else {
                this.errorLog.push(
                    {
                        row: this.rowNumber,
                        errorMessages: validationErrorLog
                    }
                );
                return false;
            }
        }).on("data",function (data:any):void {
            
            // TODO Save the report in cosmos
            
        }).on("end",():void => {
            let csvUploadResponse:object = {};
            if (this.rowNumber === 0) {
                this.errorLog.push({
                    errorMessages: `No rows were parsed. Are you sure the data is Comma Separated?`
                });
            }
        }).on("error",function (error:any) {
            this.errorLog.push(
                {
                    errorMessages: error.toString()
                }
            );
        })

        if (this.errorLog.length !== 0) {
            throw new RcdaError(
                RcdaErrorTypes.ClientError,
                "There were various errors. Please review them below - ",
                this.errorLog)
        }
    }

    private validateHeaders(data:object,errorLog:Array<string>):void {
        const csvProperties:Array<string> = Object.getOwnPropertyNames(data);
        
        for (const header of rcdaCsvHeaders) {
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
}