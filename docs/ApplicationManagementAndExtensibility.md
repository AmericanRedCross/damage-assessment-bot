# Application Management and Extensibility

## Special Values

There are several enums/special values which alter the behavior of the questions asked. You can add/edit/remove these values to fit the need.

All these enums are located at this folder path - @\common\src\models\resources\disaster-assessment\enums

These include:
- Myanmar Affected Groups (MyanmarAffectedGroups.ts)
- Myanmar Disaster Types (MyanmarDisasterTypes.ts)
- Myanmar Geographical Settings (MyanmarGeographicalSettings.ts)
- Myanmar Response Modalities (MyanmarResponseModalities.ts)
- Myanmar Basic Needs Scale (MyanmarSectorBasicNeedsConcernScale.ts)
- Myanmar Factor Impact Scale (MyanmarSectorFactorImpactScale.ts)
- Myanmar Sector Factors (MyanmarSectorFactors.ts)
- Myanmar Sectors (MyanmarSectors.ts)
- Myanmar Sector Priority Scale (MyanmarSectorSeverityScale.ts)
- Myanmar Vulnerable Groups (MyanmarVulnerableGroups.ts)
	
All of these are JSON key value pairs. For example, given below are the instructions on how we can add another Sector to report on.
9.1.1	HOW TO ADD A SECTOR TO REPORT ON
1.	Open the file located at @\common\src\models\resources\disaster-assessment\enums\MyanmarSectors.ts
2.	Now, inside this file, add a new key which is name of the Sector which you want to add and the same as value (In the following example, I have added another sector called Electricity) -
 

3.	Now, open the file located at @\api\src\chat\localization\RcdaTextEnglish.ts and then scroll down to the section where all the sectors have their display values and add the same Sector which you added in Step (2) -
 

4.	Similarly, add this property under the exact node for all the language files which implement RcdaTextEnglish class.
5.	Build the project and then deploy to see the changes

## Language Translations

The Chatbot currently supports the following languages -
1.	English
2.	Burmese (Zawgyi)
3.	Burmese (Myanmar Unicode)
	
Following are the translation files which are used by the Bot and the Web App as of now -
1.	@\api\src\chat\localization\RcdaTextEnglish.ts
2.	@\api\src\chat\localization\RcdaTextBurmeseZawgyiEncoding.ts
3.	@\api\src\chat\localization\RcdaTextBurmese.ts

The base language class is inside RcdaTextEnglish.ts file i.e. RcdaTextEnglish. All other languages implement this class. So, any change (like addition/removal or keys) needs to be reflected in all the other language classes which implement the base class.


To edit the translations, follow the given instructions -
1.	Depending on the language and encoding, open the corresponding TypeScript file (As mentioned above).
2.	Locate the entity for which you would like to edit the translation or wordings. For example, to edit the translation on how the "Health" sector is shown in Burmese in Zawgyi, you would have to edit the respective property in RcdaTextBurmeseZawgyiEncoding.ts as shown below -
 

## Myanmar Admin Stack

The app supports the top 3 levels of the Myanmar administrative stack: regions, districts, and townships. This data is sourced from MIMU using the following data sets:

- [Regions](http://geonode.themimu.info/geoserver/wfs?srsName=EPSG%3A4326&typename=geonode%3Amyanmar_state_region_boundaries_with_sub_region&outputFormat=json&version=1.0.0&service=WFS&request=GetFeature)
- [Districts](http://geonode.themimu.info/geoserver/wfs?srsName=EPSG%3A4326&typename=geonode%3Amyanmar_district_boundaries&outputFormat=json&version=1.0.0&service=WFS&request=GetFeature)
- [Townships](http://geonode.themimu.info/geoserver/wfs?srsName=EPSG%3A4326&typename=geonode%3Amyanmar_township_boundaries&outputFormat=json&version=1.0.0&service=WFS&request=GetFeature)

We download a GeoJSON of the data, parse it and strip it down to the essential pieces of information, and then make it available to the chat bot and web app. The script to update the this data runs each time you run npm install at the root of the repository and during deployments.

The output of this process is captured under `common/src/system/countries/myanmar/myanmarAdminStack.json`.