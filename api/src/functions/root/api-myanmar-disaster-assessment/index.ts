import fast_csv = require("fast-csv");
import { csvHeaders } from "./csvHeaders";
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

interface IErrorLog {
    row?: number,
    errorMessages: Array<string>|string
}

const numberOfTopAffectedGroups:number = 3;
const numberOfTopPrioritySectors:number = 3;
const numberOfTopVulnerableGroups:number = 3;
const numberOfTopResponseModalities:number = 3;



module.exports = function (context:any,req:any):void {
    
    // Ensure Content-Type header is set properly
    const acceptableContentTypes:Array<string> = [
        "text/plain",
        "text/csv",
        "application/vnd.ms-excel"
    ];
    if (!acceptableContentTypes.includes(req.headers['content-type'])) {
        context.res = {status: 415, body: {"Message": `Only following Content-Types are acceptable - '${acceptableContentTypes}'`}};
        context.done();
    }

    // Ensure that we are not receiving an empty request
    if (!req.body) {
        context.res = {status: 400, body: {"Message": `Request received is empty!`}};
        context.done();
    }

    let rowNumber:number = 0;
    let errorLog:IErrorLog[] = [];
    
    fast_csv.fromString(req.body, {
        objectMode:true,
        headers:true,
        trim:true,

    }).validate(function (data:IUserInfo):boolean {
        context.log("Just entered...");
        if (!data) {
            return false;
        }
        
        let validationErrorLog:Array<string> = [];
        rowNumber++;
        if (rowNumber === 1) {
            validateHeaders(data,validationErrorLog);    
        }
        
        validateUserInfo(data,validationErrorLog);
        validateAffectedPeople(data,validationErrorLog);
        validateSectorSeverity(data,validationErrorLog);
        validateSectorFactorData(data,validationErrorLog);
        validateSectorBasicNeedsConcern(data,validationErrorLog);
        validateTopAffectedGroups(data,validationErrorLog);
        validateTopPrioritySectors(data,validationErrorLog);
        validateTopVulnerableGroups(data,validationErrorLog);
        validateTopResponseModalities(data,validationErrorLog);
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
    }).on("data-invalid", function (data:any):void {
        context.log("Data is Invalid! Please review the errors below.");
    }).on("data",function (data:any):void {
        
        // TODO Save the report in cosmos
        
        context.log(JSON.stringify(createReport(data)));
    }).on("end",function ():void {
        let csvUploadResponse:object = {};
        if (rowNumber === 0) {
            errorLog.push({
                errorMessages: `No rows were parsed. Are you sure the data is Comma Separated?`
            });
        }
        if (errorLog.length === 0) {
            context.log("Data has been imported successfully!");
            csvUploadResponse["Message"] = "Data has been imported successfully!";
            context.res = {status: 200, body: csvUploadResponse};
        } else {
            context.log("There were various errors. Please review them below - ");
            csvUploadResponse["Message"] = "There were various errors. Please review them below - ";
            csvUploadResponse["Errors"] = errorLog;
            context.res = {status: 422, body: csvUploadResponse};
        }
        context.done();
    }).on("error",function (error:any) {
        errorLog.push(
            {
                errorMessages: error.toString()
            }
        );
    })
}

function validateHeaders(data:object,errorLog:Array<string>):void {
    const csvProperties:Array<string> = Object.getOwnPropertyNames(data);
    
    for (const header of csvHeaders) {
        if (!csvProperties.includes(header)) {
            errorLog.push(`CSV header was not recognized: '${header}'`);
        }
    }
}

interface IUserInfo {
    townshipId: string,
    disasterTypeId: MyanmarDisasterTypes,
    geographicalSettingId: MyanmarGeographicalSettings
}

function validateUserInfo({townshipId, disasterTypeId, geographicalSettingId}:IUserInfo,errorLog:Array<string>):void {
    const townshipMatch:boolean = myanmarTownships.some( (element:MyanmarTownship) => {
        return element.townshipCode === townshipId;
    });

    if (!townshipMatch) {
        errorLog.push(`Could not find township [${townshipId}]`);
    }

    if (!Object.values(MyanmarDisasterTypes).includes(disasterTypeId)) {
        errorLog.push(`Did not find the Disaster Type ID [${disasterTypeId}]`);
    }
    
    if (!Object.values(MyanmarGeographicalSettings).includes(geographicalSettingId)) {
        errorLog.push(`The Geographical Setting is not valid [${geographicalSettingId}]`)
    }
};

function isNumeric(x:string,base:number=10):boolean {
    const parsedInt = parseInt(x,base);
    if (isNaN(parsedInt)) {
        return false;
    } else {
        return true;
    }
}


function validateAffectedPeople(data:object,errorLog:Array<string>):void {
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
        if (!isNumeric(data[element])) {
            errorLog.push(`[${element}] needs to be a number!`)
        }
    });
}

function validateSectorSeverity(data:object,errorLog:Array<string>):void {
    
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
        if (isNumeric(data[header])) {
            if (!Object.values(MyanmarSectorSeverityScale).includes(parseInt(data[header]))) {
                errorLog.push(`The value for header [${header}] is not within range.`);
            }
        } else {
            errorLog.push(`The value for header [${header}] is not a number.`);
            
        }
    });
}

function validateSectorFactorData(data:object,errorLog:Array<string>):void {
    Object.values(MyanmarSectors).forEach((sector)=> {
        Object.values(MyanmarSectorFactors).forEach( (factor) => {
            const sectorFactorScore:string = data[`sector${sector}${factor}`];
            if (isNumeric(sectorFactorScore)) {
                if (!Object.values(MyanmarSectorFactorImpactScale).includes(parseInt(sectorFactorScore))) {
                    errorLog.push(`The value for sector [${sector}] and factor [${factor}] is not in range.`);
                }
            } else {
                errorLog.push(`The value for sector [${sector}] and factor [${factor}] is not a number`);
            }
        });
    });
}

function validateSectorBasicNeedsConcern(data:object,errorLog:Array<string>):void {
    Object.values(MyanmarSectors).forEach((sector) => {
        const sectorBasicNeedsConcern:string = data[`sector${sector}FutureConcern`];
        if (isNumeric(sectorBasicNeedsConcern)) {
            if (!Object.values(MyanmarSectorBasicNeedsConcernScale).includes(parseInt(sectorBasicNeedsConcern))) {
                errorLog.push(`The Future Concern for sector [${sector}] is not in range.`);
            }
        } else {
            errorLog.push(`The Future Concern for sector [${sector}] is not a number`);
        }
    });
}

function validateTopAffectedGroups(data:object,errorLog:Array<string>):void {
    for (let index = 1; index <= numberOfTopAffectedGroups; index++) {
        const affectedGroup:string = data[`topAffectedGroup${index}`];
        if (!Object.values(MyanmarAffectedGroups).includes(affectedGroup)) {
            errorLog.push(`The value for header [topAffectedGroup${index}] was not recognized.`);
        }
    }
}

function validateTopPrioritySectors(data:object,errorLog:Array<string>):void {
    for (let index = 1; index <= numberOfTopPrioritySectors; index++) {
        const affectedGroup:string = data[`topPrioritySector${index}`];
        if (!Object.values(MyanmarSectors).includes(affectedGroup)) {
            errorLog.push(`The value for header [topPrioritySector${index}] was not recognized.`);
        }
    }
}

function validateTopVulnerableGroups(data:object,errorLog:Array<string>):void {
    for (let index = 1; index <= numberOfTopVulnerableGroups; index++) {
        const affectedGroup:string = data[`topVulnerableGroup${index}`];
        if (!Object.values(MyanmarVulnerableGroups).includes(affectedGroup)) {
            errorLog.push(`The value for header [topVulnerableGroup${index}] was not recognized.`);
        }
    }
}

function validateTopResponseModalities(data:object,errorLog:Array<string>):void {
    for (let index = 1; index <= numberOfTopResponseModalities; index++) {
        const affectedGroup:string = data[`topResponseModality${index}`];
        if (!Object.values(MyanmarResponseModalities).includes(affectedGroup)) {
            errorLog.push(`The value for header [topResponseModality${index}] was not recognized.`);
        }
    }
}

function createReport(data:any):MyanmarConversationData {
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
    for (let index = 1; index <= numberOfTopAffectedGroups; index++) {
        reportData.rankings.affectedGroups.push(
            {
                rank: index,
                value: data[`topAffectedGroup${index}`]
            }
        );
    }

    // Get Values for Top Priority Sectors
    for (let index = 1; index <= numberOfTopPrioritySectors; index++) {
        reportData.rankings.prioritySectors.push(
            {
                rank: index,
                value: data[`topPrioritySector${index}`]
            }
        );
    }
    
    // Get Values for Top Vulnerable Groups
    for (let index = 1; index <= numberOfTopVulnerableGroups; index++) {
        reportData.rankings.vulnerableGroups.push(
            {
                rank: index,
                value: data[`topVulnerableGroup${index}`]
            }
        );
        
    }

    // Get Values for Top Response Modalities
    for (let index = 1; index <= numberOfTopResponseModalities; index++) {
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