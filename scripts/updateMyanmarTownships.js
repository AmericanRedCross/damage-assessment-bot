const axios = require("axios");
const fs = require("fs");
const google_myanmar_tools = require("myanmar-tools"); 
const mmConverter = new google_myanmar_tools.ZawgyiConverter();

(async function() {

    // data sourced from web page http://geonode.themimu.info/layers/geonode%3Amyanmar_township_boundaries (click link 'Download Layer', then 'GeoJSON')
    const myanmarRegionsResponse = await axios.get("http://geonode.themimu.info/geoserver/wfs?srsName=EPSG%3A4326&typename=geonode%3Amyanmar_state_region_boundaries_with_sub_region&outputFormat=json&version=1.0.0&service=WFS&request=GetFeature")
    const myanmarDistrictsResponse = await axios.get("http://geonode.themimu.info/geoserver/wfs?srsName=EPSG%3A4326&typename=geonode%3Amyanmar_district_boundaries&outputFormat=json&version=1.0.0&service=WFS&request=GetFeature")
    const myanmarTownshipsResponse = await axios.get("http://geonode.themimu.info/geoserver/wfs?srsName=EPSG%3A4326&typename=geonode%3Amyanmar_township_boundaries&outputFormat=json&version=1.0.0&service=WFS&request=GetFeature")

    const regions = {};
    myanmarRegionsResponse.data.features.forEach(({ properties }) => {
        let regionId = properties["ST_PCODE"];
        regions[regionId] = {
            regionCode: regionId,
            regionName: properties["ST"],
            regionNameBurmese: properties["NAME_M3"],
            regionNameBurmeseZawgyi: mmConverter.unicodeToZawgyi(properties["NAME_M3"])
        };
    });
    
    const districts = {};
    myanmarDistrictsResponse.data.features.forEach(({ properties }) => {
        let districtId = properties["DT_PCODE"];
        districts[districtId] = {
            districtCode: districtId,
            districtName: properties["DT"],
            districtNameBurmese: properties["DT_Name_M3"],
            districtNameBurmeseZawgyi: mmConverter.unicodeToZawgyi(properties["DT_Name_M3"])
        };
    });

    const townships = [];    
    for (let { properties: township } of myanmarTownshipsResponse.data.features) {

        townships.push({
            ...regions[township["ST_PCODE"]],
            ...districts[township["DT_PCODE"]],
            townshipCode: township["TS_PCODE"],
            townshipName: township["TS"],
            townshipNameBurmese: township["T_NAME_M3"],
            townshipNameBurmeseZawgyi: mmConverter.unicodeToZawgyi(township["T_NAME_M3"])
        });
    }

    // sort townships by region, then by district, then by township
    // using a sort makes the output predictable, which will reduce noise in the git diff
    townships.sort((a, b) => {
        aComesBeforeB = undefined;
        if (a.regionCode !== b.regionCode) {
            aComesBeforeB = a.regionCode < b.regionCode;
        }
        else if (a.districtCode !== b.districtCode) {
            aComesBeforeB = a.districtCode < b.districtCode;
        }
        else if (a.townshipCode !== b.townshipCode) {
            aComesBeforeB = a.townshipCode < b.townshipCode;
        }
        else {
            throw new Error(`Duplicate township found: ${a.townshipCode}`);
        }
        // output is expected in form of negative or positive number
        return aComesBeforeB ? -1 : 1; 
    });

    let content = JSON.stringify(townships, null, 4);
    fs.writeFileSync(`${__dirname}/../common/src/system/countries/myanmar/myanmarTownships.json`, content);
    
    const locations = {
        regions: {}
    };
    for (let township of townships) {

        let region = locations.regions[township.regionCode];
        if (!region) {
            region = locations.regions[township.regionCode] = {};
        }
        region.code = township.regionCode;
        region.name = township.regionName;
        region.nameBurmese = township.regionNameBurmese;
        region.nameBurmeseZawgyi = township.regionNameBurmeseZawgyi
        region.districts = region.districts || {};
        
        let district = region.districts[township.districtCode];
        if (!district) {
            district = region.districts[township.districtCode] = {};
        }
        district.code = township.districtCode;
        district.name = township.districtName;
        district.nameBurmese = township.districtNameBurmese;
        district.nameBurmeseZawgyi = township.districtNameBurmeseZawgyi;
        district.regionCode = region.code;
        district.townships = district.townships || {};
        
        let township2 = district.townships[township.townshipCode];
        if (!township2) {
            township2 = district.townships[township.townshipCode] = {};
        }
        township2.code = township.townshipCode;
        township2.name = township.townshipName;
        township2.nameBurmese = township.townshipNameBurmese;
        township2.nameBurmeseZawgyi = township.townshipNameBurmeseZawgyi;
        township2.regionCode = region.code;
        township2.districtCode = district.code;
    }
    
    fs.writeFileSync(`${__dirname}/../common/src/system/countries/myanmar/myanmarAdminStack.json`, JSON.stringify(locations, null, 4));
})();