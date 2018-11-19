import { HttpStatusCode } from "azure-functions-ts-essentials";
import rcdaHttpFunction from "@/functions/utils/rcdaHttpFunction";
import fast_csv = require("fast-csv");
import MyanmarConversationData, { MyanmarSectorFactorInput, MyanmarAffectedPeopleSectionInput } from "@/chat/models/MyanmarConversationData"
import { SectorFactors, MyanmarSectorFactors } from "@/chat/dialogs/myanmar/disaster-assessment/utils/SectorFactors"
import { Sectors, MyanmarSectors } from "@/chat/dialogs/myanmar/disaster-assessment/utils/Sectors";
let parseMultipart:any = require("parse-multipart");


module.exports = function (context:any,req:any):void {
    context.log('JavaScript HTTP trigger function processed a request.');
    
    const requestBody = req.body;

    fast_csv.fromString(requestBody, {
        objectMode:true,
        headers:true,
        trim:true
    }).on("data",function (data:any):void {
        context.log(typeof data.townshipId);
        context.log(JSON.stringify(createReport(data)));
    }).on("end",function ():void {
        context.done();
    })
}

function createReport(data:any):MyanmarConversationData {
    const reportData = new MyanmarConversationData();
    
    reportData.townshipId = data.townshipId;
    reportData.disasterTypeId = data.disasterTypeId;
    reportData.geographicalSettingId = data.geographicalSettingId;

    // const people:MyanmarAffectedPeopleSectionInput = new MyanmarAffectedPeopleSectionInput();
    // console.log(JSON.stringify(Object.keys(people)));

    // for (const key of Object.keys(new MyanmarAffectedPeopleSectionInput())) {
    //     console.log(JSON.stringify(key));
    //     console.log(JSON.stringify(data[key]));
    //     reportData.people[key] = parseInt(data[key])
    // }

    reportData.people.numberOfCasualties = data.numberOfCasualties;
    reportData.people.numberOfPeopleBeforeDisaster = data.numberOfPeopleBeforeDisaster;
    reportData.people.numberOfPeopleDisplaced = data.numberOfPeopleDisplaced;
    reportData.people.numberOfPeopleLeftArea = data.numberOfPeopleLeftArea;
    reportData.people.numberOfPeopleLivingCurrently = data.numberOfPeopleLivingCurrently;
    reportData.people.numberOfPeopleNotDisplaced = data.numberOfPeopleNotDisplaced;
    reportData.people.numberOfPeopleReturned = data.numberOfPeopleReturned;
    reportData.people.totalNumberOfPeopleAffected = data.totalNumberOfPeopleAffected;

    reportData.rankings.affectedGroups = [
        {
            rank: 1,
            value: data.topAffectedGroup1
        },
        {
            rank: 2,
            value: data.topAffectedGroup2
        },
        {
            rank: 3,
            value: data.topAffectedGroup3
        }
    ];

    reportData.rankings.prioritySectors = [
        {
            rank: 1,
            value: data.topPrioritySector1
        },
        {
            rank: 2,
            value: data.topPrioritySector2
        },
        {
            rank: 3,
            value: data.topPrioritySector3
        }
    ];

    reportData.rankings.responseModalities = [
        {
            rank: 1,
            value: data.topResponseModality1
        },
        {
            rank: 2,
            value: data.topResponseModality2
        },
        {
            rank: 3,
            value: data.topResponseModality3
        }
    ];

    reportData.rankings.vulnerableGroups = [
        {
            rank: 1,
            value: data.topVulnerableGroup1
        },
        {
            rank: 2,
            value: data.topVulnerableGroup2
        },
        {
            rank: 3,
            value: data.topVulnerableGroup3
        }
    ];

    Sectors.forEach( (sector:MyanmarSectors) => {
        const sectorId = sector.id;
        const sectorSeverity = data["sector" + sector + "Severity"];
        const sectorbasicNeedsConcern = data["sector" + sector + "FutureConcern"];
        let sectorFactorsArray:MyanmarSectorFactorInput[] = [];

        SectorFactors.forEach( (sectorFactor:MyanmarSectorFactors) => {
            sectorFactorsArray.push({
                id: sectorFactor.id,
                factorScore: data["sector" + sector.name.en + sectorFactor.name.en]
            });
        });

        reportData.sectors.completedSectors.push(
            {
                id: sectorId,
                factors: sectorFactorsArray,
                severity: sectorSeverity,
                basicNeedsConcern: sectorbasicNeedsConcern
            }
        );
    });

    return reportData;
}