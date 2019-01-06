import * as myanmarAdminStackJson from "@common/system/countries/myanmar/myanmarAdminStack.json";
import { getKeys } from "@common/utils/objectHelpers";

export default interface MyanmarAdminStack {
    regions: { 
        [regionCode: string]: {
            code: string;
            name: string;
            nameBurmese: string;
            districts: {
                [districtCode: string]: {
                    code: string;
                    name: string;
                    nameBurmese: string;
                    townships: {
                        [townshipCode: string]: {
                            code: string;
                            name: string;
                            nameBurmese: string;
                        }
                    }
                }
            }
        }
    }
}

type MyanmarLocation = {
    code: string;
    name: string;
    nameBurmese: string;
}

// @ts-ignore
export const myanmarAdminStack: MyanmarAdminStack = myanmarAdminStackJson;

export const myanmarRegions = myanmarAdminStack.regions;
export const myanmarDistricts: { [x: string]: MyanmarLocation } = {};
export const myanmarTownships: { [x: string]: MyanmarLocation } = {};

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