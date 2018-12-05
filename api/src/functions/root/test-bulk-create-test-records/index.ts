import { HttpStatusCode } from "azure-functions-ts-essentials";
import rcdaHttpFunction from "@/functions/utils/rcdaHttpFunction";
import DisasterAssessmentRepo from "@/repo/DisasterAssessmentRepo";
import * as uuid from "uuid";
import { myanmarTownships } from "@common/system/countries/myanmar/MyanmarTownship";
import MyanmarDisasterAssessmentReportModel from "@common/models/resources/disaster-assessment/myanmar/MyanmarDisasterAssessmentModel";
import { MyanmarSectors } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarSectors";
import { MyanmarDisasterTypes } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarDisasterTypes";
import { MyanmarGeographicalSettings } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarGeographicalSettings";
import { MyanmarResponseModalities } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarResponseModalities";
import { MyanmarVulnerableGroups } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarVulnerableGroups";
import { MyanmarAffectedGroups } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarAffectedGroups";
import { enumValues } from "@common/utils/enumHelpers";
import RcdaCountries from "@common/system/RcdaCountries";
import MyanmarDisasterAssessmentService from "@/services/disaster-assessment/MyanmarDisasterAssessmentService";

class Dependencies {

  constructor(public disasterAssessmentService: MyanmarDisasterAssessmentService) { }

  static getInstance(): Dependencies {
    return new Dependencies(MyanmarDisasterAssessmentService.getInstance());
  }
}

function randomInt(max: number) {
  return Math.floor(Math.random() * max);
}

function selectRandom<T>(array: T[]): T {
  return array[randomInt(array.length)];
}

function mapObject<TIn, TOut>(arg: TIn, mapper: (arg: TIn) => TOut) {
  return mapper(arg);
}

function randomSet<T>(values: T[], top: number): T[] {
  values = [...values];
  var j, x, i;
  for (i = values.length - 1; i > 0; i--) {
      j = randomInt(i + 1);
      x = values[i];
      values[i] = values[j];
      values[j] = x;
  }
  return values.slice(0, top);
}

export default rcdaHttpFunction<void, void, Dependencies>(
Dependencies.getInstance,
true,
async (req, { disasterAssessmentService }) => {

  for (let i = 0; i < 10000; i++) {
    let report: MyanmarDisasterAssessmentReportModel = {
        id: uuid(),
        userId: "",//TODO, get this aligned with user
        creationDate: JSON.stringify(new Date()).slice(1, -1),
        country: RcdaCountries.Myanmar,
        location: mapObject(selectRandom(myanmarTownships), x => ({
          regionCode: x.regionCode,
          districtCode: x.districtCode,
          townshipCode: x.townshipCode
        })),
        disasterType: selectRandom(enumValues<MyanmarDisasterTypes>(MyanmarDisasterTypes)),
        geographicalSetting: selectRandom(enumValues<MyanmarGeographicalSettings>(MyanmarGeographicalSettings)),
        people: {
            numberBeforeDisaster: randomInt(20000),
            numberLeftArea: randomInt(20000),
            numberReturned: randomInt(20000),
            numberStayedInArea: randomInt(20000),
            numberAffected: randomInt(20000),
            numberDisplaced: randomInt(20000),
            numberNotDisplaced: randomInt(20000),
            numberOfCasualties: randomInt(20000),
        },
        rankings: {
            responseModalities: randomSet(enumValues<MyanmarResponseModalities>(MyanmarResponseModalities), randomInt(3)),
            vulnerableGroups: randomSet(enumValues<MyanmarVulnerableGroups>(MyanmarVulnerableGroups), randomInt(3)),
            affectedGroups: randomSet(enumValues<MyanmarAffectedGroups>(MyanmarAffectedGroups), randomInt(3)),
            prioritySectors: randomSet(enumValues<MyanmarSectors>(MyanmarSectors), randomInt(3))
        },
        sectors: null
    };
    let date = new Date();
    date.setFullYear(2018, randomInt(12), randomInt(29));
    await disasterAssessmentService.create({
      id: uuid(),
      userId: uuid(),//TODO, get this aligned with user
      creationDate: JSON.stringify(date).slice(1, -1),
      ...report
    });
  }

  return {
    status: HttpStatusCode.OK,
    body: null
  };
});