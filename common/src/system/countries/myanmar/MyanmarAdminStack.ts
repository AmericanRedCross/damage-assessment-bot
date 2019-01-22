import * as myanmarAdminStackJson from "@common/system/countries/myanmar/myanmarAdminStack.json";
import { getKeys } from "@common/utils/objectHelpers";

export default interface MyanmarAdminStack {
    regions: { [key: string]: MyanmarRegion }
}

interface MyanmarRegion extends MyanmarLocation { 
    districts: { [key: string]: MyanmarDistrict }
}

interface MyanmarDistrict extends MyanmarLocation { 
    townships: { [key: string]: MyanmarTownship }
    regionCode: string;
}

interface MyanmarTownship extends MyanmarLocation {    
    regionCode: string;
    districtCode: string;
}

interface MyanmarLocation {
    code: string;
    name: string;
    nameBurmese: string;
    nameBurmeseZawgyi: string;
}

export const myanmarAdminStack: MyanmarAdminStack = myanmarAdminStackJson;

export const myanmarRegions: { [x: string]: MyanmarRegion } = myanmarAdminStack.regions;
export const myanmarDistricts: { [x: string]: MyanmarDistrict } = {};
export const myanmarTownships: { [x: string]: MyanmarTownship } = {};

getKeys(myanmarAdminStack.regions).forEach(regionCode => {
    let region = myanmarAdminStack.regions[regionCode];
    getKeys(region.districts).forEach(districtCode => {
        let district = region.districts[districtCode];
        myanmarDistricts[districtCode] = district;
        getKeys(district.townships).forEach(townshipCode => {
            myanmarTownships[townshipCode] = district.townships[townshipCode];
        });
    });
});