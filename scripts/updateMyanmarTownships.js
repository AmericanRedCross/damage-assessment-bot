const axios = require("axios");
const fs = require("fs");

(async function() {

    // data sourced from web page http://geonode.themimu.info/layers/geonode%3Amyanmar_township_boundaries (click link 'Download Layer', then 'GeoJSON')
    let myanmarTownshipsResponse = await axios.get("http://geonode.themimu.info/geoserver/wfs?srsName=EPSG%3A4326&typename=geonode%3Amyanmar_township_boundaries&outputFormat=json&version=1.0.0&service=WFS&request=GetFeature")

    let townships = [];
    
    for (let feature of myanmarTownshipsResponse.data.features) {

        let township = feature.properties;

        townships.push({
            townshipName: township["TS"],
            districtName: township["DT"],
            regionName: township["ST"],
            townshipNameBurmese: township["T_NAME_M3"],
            townshipCode: township["TS_PCODE"],
            districtCode: township["DT_PCODE"],
            regionCode: township["ST_PCODE"],
        });
    }

    // sort townships by region, then by district, then by township
    // using a sort makes the output predictable, which will reduce noise in the git diff
    townships.sort((a, b) => {
        aComesBeforeB = undefined;
        if (a.regionName !== b.regionName) {
            aComesBeforeB = a.regionName < b.regionName;
        }
        else if (a.districtName !== b.districtName) {
            aComesBeforeB = a.districtName < b.districtName;
        }
        else if (a.townshipName !== b.townshipName) {
            aComesBeforeB = a.townshipName < b.townshipName;
        }
        else {
            throw new Error(`Duplicate township found: ${a.townshipName}`);
        }
        // output is expected in form of negative or positive number
        return aComesBeforeB ? -1 : 1; 
    });

    let content = JSON.stringify(townships, null, 4);
    fs.writeFileSync(`${__dirname}/../common/src/system/countries/myanmar/myanmarTownships.json`, content);
})();