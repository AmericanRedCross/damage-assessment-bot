import RcdaEnumLabels from "@common/utils/RcdaEnumLabels";
import { makeObjectWithKeys, getKeys } from "@common/utils/objectHelpers";
import { MyanmarAffectedGroups as AffectedGroups } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarAffectedGroups";
import { MyanmarDisasterTypes as DisasterTypes } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarDisasterTypes";
import { MyanmarGeographicalSettings as GeographicalSettings } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarGeographicalSettings";
import { MyanmarResponseModalities as ResponseModalities } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarResponseModalities";
import { MyanmarSectorBasicNeedsConcernScale as SectorBasicNeedsConcernScale } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarSectorBasicNeedsConcernScale";
import { MyanmarSectorFactorImpactScale as SectorFactorImpactScale } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarSectorFactorImpactScale";
import { MyanmarSectorFactors as SectorFactors } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarSectorFactors";
import { MyanmarSectors as Sectors } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarSectors";
import { MyanmarSectorSeverityScale as SectorSeverityScale } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarSectorSeverityScale";
import { MyanmarVulnerableGroups as VulnerableGroups } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarVulnerableGroups";
import { RcdaCommonTextEnglish, RcdaMyanmarTextEnglish } from "@/localization/RcdaTextEnglish";
import { myanmarRegions, myanmarDistricts, myanmarTownships } from "@common/system/countries/myanmar/MyanmarAdminStack";

// This specifies text for common functionality that is not specific to any country, such as welcome dialogues, generic labels, etc.
export class RcdaCommonTextBurmese implements RcdaCommonTextEnglish {
    siteTitle = "ပျက်စီးဆုံးရှုံးမှုအကဲဖြတ်ဒိုင်ခွက်";
    // inputs
    languageSelectorLabel = "ဘာသာစကားများကိုရွေးချယ်ပါ";
    fileSelectorLabel = "ရှေးခယျြ";
    dropdownInputSelectAllOption = "အားလုံး";
    // login
    loginFieldsMissingError = "A value must be provided for username and password";
    loginInvalidError = "Login failed due to invalid username or password";
    loginUsernameLabel = "နာမတျောကို";
    loginPasswordLabel = "စကားဝှက်ကို";
    loginPasswordRecoveryLink = "စကားဝှက်ကိုမေ့နေပါသလား?";
    loginSubmitButton = "လော့ဂ်အင်";
    loginProviderDescription = "Use your IFRC GO credentials";
    loginRegistrationLink = "Register for an account";

}

export class RcdaMyanmarTextBurmese implements RcdaMyanmarTextEnglish {
    // dashboard
    dashboardCloseFilterPanelButton = "အနီးကပ်စိစစ်မှုများ";
    dashboardOpenFilterPanelButton = "ပွင့်လင်းစိစစ်မှုများ";
    dashboardFileImportButton = "လွှတ်တင်ခြင်း";
    dashboardDownloadCsvTemplateButton = "CSV Template";
    dashboardChatbotLink = "Go to Chatbot";
    dashboardRankingSeeAllButton = "အားလုံးနားဆင်နိုင်ပါတယ်ကိုကြည့်ပါ";
    dashboardSummaryHeadersAllDisasterTypes = "All Disaster Event Types";
    // filter panel
    dashboardFilterHeader = "စိစစ်မှုများ";
    dashboardFilterDisasterTypeInutLabel = "Disaster Event Type";
    dashboardFilterLocationInputGroupLabel = "တည်နေရာ";
    dashboardFilterRegionInputLabel = "Region";
    dashboardFilterDistrictInputLabel = "District";
    dashboardFilterTownshipInputLabel = "Township";
    dashboardFilterDateRangeInputGroupLabel = "Date Range";
    dashboardFilterStartDateInputLabel = "Start Date";
    dashboardFilterEndDateInputLabel = "End Date";
    dashboarFilterApplyButton = "Apply Filters";
    // file import
    dashboardFileImportHeader = "Upload CSV File";
    dashboardFileImportNoFileSelectedError = "No file was selected. Please select a file to import.";
    dashboardFileImportSuccessMessage = "File import finished successfully.";
    dashboardFileImportFailureMessage = "File import failed";
    dashboardFileImportSelectFileLabel = "Select File";
    dashboardFileImportAcceptedFileTypesHelpText = "Only .csv and .json files with correct values will be accepted. Excel (.xlsx) files will not be accepted.";
    dashboardFileImportErrorBehaviorHelpText = "If any validation issues are found, no records will be processed. Error details will be displayed below.";
    // people
    dashboardPeopleMetrics = {
        numberAffected: "Number of people affected (SUM)",
        numberBeforeDisaster: "Number of people before disaster",
        numberDisplaced: "Number of people displaced",
        numberLeftArea: "Number of people who have left the area",
        numberNotDisplaced: "Number affected non-displaced",
        numberOfCasualties: "Number of casualties",
        numberReturned: "Number of people who have returned",
        numberStayedInArea: "Number of people currently living in the area"
    };
    // rankings    
    dashboardRankingResponseModalitiesTitle = "Response Modalities";
    dashboardRankingPrioritySectorsTitle = "Priority Sectors";
    dashboardRankingVulnerableGroupsTitle = "Vulnerable Groups";
    dashboardRankingAffectedGroupsTitle = "Affected Groups";
    // sectors    
    dashboardSectorHeatmapSeverityHeader = "Severity";
    dashboardSectorHeatmapFactorsHeader = "Factors";
    dashboardSectorHeatmapBasicNeedsHeader = "Basic Needs Concern";
    // value labels
    disasterTypes: RcdaEnumLabels<DisasterTypes> = {
        [DisasterTypes.CarAccident]: "Car accident",
        [DisasterTypes.Cyclone]: "Cyclone",
        [DisasterTypes.Earthquake]: "Earthquake",
        [DisasterTypes.Explosion]: "Explosion",
        [DisasterTypes.Fire]: "Fire",
        [DisasterTypes.Flood]: "Flood",
        [DisasterTypes.IDP]: "IDP",
        [DisasterTypes.Landslide]: "Landslide",
        [DisasterTypes.Other]: "Other",
        [DisasterTypes.Shooting]: "Shooting",
        [DisasterTypes.StrongWind]: "Strong wind",
        [DisasterTypes.Tornado]: "Tornado",
        [DisasterTypes.Wreck]: "Wreck"
    };
    geographicalSettings: RcdaEnumLabels<GeographicalSettings> = {
        [GeographicalSettings.Rural]: "Rural",
        [GeographicalSettings.Urban]: "Urban",
        [GeographicalSettings.SemiUrban]: "Semi-Urban"
    };
    sectors: RcdaEnumLabels<Sectors> = {
        [Sectors.Health]: "Health",
        [Sectors.Food]: "Food",
        [Sectors.Wash]: "Wash",
        [Sectors.ShelterNFI]: "Shelter/NFI",
        [Sectors.Protection]: "Protection",
        [Sectors.Education]: "Education",
        [Sectors.Livelihood]: "Livelihood",
        [Sectors.Other]: "Other"
    };
    sectorFactors: RcdaEnumLabels<SectorFactors> = {
        [SectorFactors.Access]: "Access",
        [SectorFactors.Availability]: "Availability",
        [SectorFactors.Quality]: "Quality",
        [SectorFactors.Use]: "Use",
    };
    sectorBasicNeedsConcernScale: RcdaEnumLabels<SectorBasicNeedsConcernScale> = {
        [1]: "People do not feel worried at all about meeting this need",
        [2]: "People are worried but think they should be able to cope",
        [3]: "People are worried about the wellbeing of some or all their family members and not sure they will be able to cope",
        [4]: "People are worried about the health of some or all their family members",
        [5]: "People are worried about the life of some or all their family members"
    };
    sectorFactorImpactScale: RcdaEnumLabels<SectorFactorImpactScale> = {
        [0]: "Factor with Zero Impact",
        [1]: "Factor with Low Impact",
        [2]: "Factor with Medium Impact",
        [3]: "Factor with High Impact"
    };
    sectorSeverityScale: RcdaEnumLabels<SectorSeverityScale> = {
        [1]: "No concern – situation under control",
        [2]: "Situation of concern that requires monitoring",
        [3]: "Many people are suffering because of insufficient [supply of goods or services]",
        [4]: "Many people will die because [supply of goods or services] are insufficient",
        [5]: "Many people are known to be dying due to insufficient [supply of goods or services]"
    };
    affectedGroups: RcdaEnumLabels<AffectedGroups> = {
        [AffectedGroups.DisplacedIdp]: "Displaced IDP",
        [AffectedGroups.DisplacedRefugeesAndAsylumSeekers]: "Displaced Refugees & Asylum Seekers",
        [AffectedGroups.DisplacedReturnees]: "Displaced Returnees",
        [AffectedGroups.DisplacedOthers]: "Displaced Others of Concern",
        [AffectedGroups.NonDisplacedHost]: "Non-Displaced Host",
        [AffectedGroups.NonDisplacedNonHost]: "Non-Displaced Non-Host"
    };
    responseModalities: RcdaEnumLabels<ResponseModalities> = {
        [ResponseModalities.Foods]: "Foods",
        [ResponseModalities.HygeineItems]: "Hygiene Items",
        [ResponseModalities.Misc]: "Misc",
        [ResponseModalities.NFIs]: "NFI(s)",
        [ResponseModalities.RestoringFamilyLinks]: "Restoring Family Links",
        [ResponseModalities.Shelter]: "Shelter"
    };
    vulnerableGroups: RcdaEnumLabels<VulnerableGroups> = {
        [VulnerableGroups.Children]: "Children",
        [VulnerableGroups.ChronicallyIll]: "Chronically Ill",
        [VulnerableGroups.Elderly]: "Elderly",
        [VulnerableGroups.FemaleHeadOfHousehold]: "Female Head of Household",
        [VulnerableGroups.LactatingMothers]: "Lactating Mothers",
        [VulnerableGroups.MentallyDisabled]: "Mentally Disabled",
        [VulnerableGroups.MothersWithInfants]: "Mothers with infants",
        [VulnerableGroups.PhysicallyDisabled]: "Physically disabled",
        [VulnerableGroups.PregnantWomen]: "Pregnant Women",
        [VulnerableGroups.Sick]: "Sick",
        [VulnerableGroups.SingleHeadedHousehold]: "Single Headed Household"
    };
    regions = makeObjectWithKeys(getKeys(myanmarRegions), (regionCode) => myanmarRegions[regionCode].nameBurmese);
    districts = makeObjectWithKeys(getKeys(myanmarDistricts), (districtCode) => myanmarDistricts[districtCode].nameBurmese);
    townships = makeObjectWithKeys(getKeys(myanmarTownships), (townshipCode) => myanmarTownships[townshipCode].nameBurmese);
}