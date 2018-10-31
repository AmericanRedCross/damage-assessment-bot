import myanmarTownshipsJson = require("@common/system/countries/myanmar/myanmarTownships.json");

export interface MyanmarTownship {
    townshipName: string;
    districtName: string;
    regionName: string;
    townshipNameBurmese: string;
    townshipCode: string;
    districtCode: string;
    regionCode: string;
}

export const myanmarTownships: MyanmarTownship[] = myanmarTownshipsJson;