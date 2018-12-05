import { makeObjectWithEnumKeys, enumValues } from "@common/utils/enumHelpers";
import { MyanmarSectors } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarSectors";
import { MyanmarSectorFactors } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarSectorFactors";
import { MyanmarResponseModalities } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarResponseModalities";
import { MyanmarVulnerableGroups } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarVulnerableGroups";
import { MyanmarAffectedGroups } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarAffectedGroups";

export default {
    count: 0,
    startDate: new Date().toJSON(),
    endDate: new Date().toJSON(),
    disasterType: <any>null,
    location: {
      regionCode: <any>null,
      districtCode: <any>null,
      townshipCode: <any>null
    },
    sectors: makeObjectWithEnumKeys(enumValues<MyanmarSectors>(MyanmarSectors), () => ({
      severity: 0,
      basicNeedsConcern: 0,
      factors: makeObjectWithEnumKeys(enumValues<MyanmarSectorFactors>(MyanmarSectorFactors), () => 0)
    })),
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
      responseModalities: [MyanmarResponseModalities.Foods, MyanmarResponseModalities.Misc, MyanmarResponseModalities.NFIs, MyanmarResponseModalities.Foods, MyanmarResponseModalities.Misc, MyanmarResponseModalities.NFIs],
      prioritySectors: [MyanmarSectors.Health, MyanmarSectors.ShelterNFI, MyanmarSectors.Wash, MyanmarSectors.Health, MyanmarSectors.ShelterNFI, MyanmarSectors.Wash],
      vulnerableGroups: [MyanmarVulnerableGroups.ChronicallyIll, MyanmarVulnerableGroups.FemaleHeadOfHousehold, MyanmarVulnerableGroups.MothersWithInfants, MyanmarVulnerableGroups.ChronicallyIll, MyanmarVulnerableGroups.FemaleHeadOfHousehold, MyanmarVulnerableGroups.MothersWithInfants],
      affectedGroups: [MyanmarAffectedGroups.DisplacedIdp, MyanmarAffectedGroups.DisplacedOthers, MyanmarAffectedGroups.NonDisplacedNonHost, MyanmarAffectedGroups.DisplacedIdp, MyanmarAffectedGroups.DisplacedOthers, MyanmarAffectedGroups.NonDisplacedNonHost]
    }
  };