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
import { MyanmarDisasterAssessmentSummaryPeople } from "@common/models/services/myanmar-disaster-assessment-summary/GenerateMyanmarDisasterAssessmentSummaryResponse";
import { myanmarRegions, myanmarDistricts, myanmarTownships } from "@common/system/countries/myanmar/MyanmarAdminStack";

// This specifies text for common functionality that is not specific to any country, such as welcome dialogues, generic labels, etc.
export class RcdaCommonTextEnglish {
    siteTitle = "Damage Assessment Dashboard";
    signOutButton = "Sign out";
    confirmSignOut = "Are you sure you want to sign out? Any unfinished chat reports will not be saved.";
    sessionTimeoutMessage = "Your session has expired. Any unfinished chat reports were not saved.";
    // inputs
    languageSelectorLabel = "Select Language";
    fileSelectorLabel = "Browse";
    dropdownInputSelectAllOption = "All";
    // login
    loginHeader = "Login";
    loginFieldsMissingError = "A value must be provided for username and password";
    loginCredentialsInvalidError = "Invalid username or password";
    loginUnknownError = "Login failed unexpectedly, please try again later";
    loginUsernameLabel = "Username";
    loginPasswordLabel = "Password";
    loginPasswordRecoveryLink = "Forgot Password?";
    loginSubmitButton = "Login";
    loginProviderDescription = "Use your IFRC GO credentials";
    loginRegistrationLink = "Register for an account";
}

export class RcdaMyanmarTextEnglish {
    // dashboard
    dashboardCloseFilterPanelButton = "Close Filters";
    dashboardOpenFilterPanelButton = "Open Filters";
    dashboardFileImportButton = "File Upload";
    dashboardDownloadCsvTemplateButton = "CSV Template";
    dashboardChatbotLink = "Go to Chatbot";
    dashboardRankingSeeAllButton = "See All Reported";
    dashboardSummaryHeadersAllDisasterTypes = "All Disaster Event Types";
    dashboardSummaryHeadersAllRegions = "All Regions";
    dashboardSectorHeatmapHeader = "Summary";
    // filter panel
    dashboardFilterHeader = "Filters";
    dashboardFilterDisasterTypeInutLabel = "Disaster Event Type";
    dashboardFilterLocationInputGroupLabel = "Location";
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
    dashboardFileImportFailedUnexpectedly = "File import failed unexpectedly. Please try again later.";
    dashboardFileImportFailedValidation = "File import failed because one or more issues were found. Please fix these issues and try again.";
    dashboardFileImportSelectFileLabel = "Select File";
    dashboardFileImportAcceptedFileTypesHelpText = "Only .csv and .json files with correct values will be accepted. Excel (.xlsx) files will not be accepted.";
    dashboardFileImportErrorBehaviorHelpText = "If any validation issues are found, no records will be processed. Error details will be displayed above.";
    dashboardFileImportSubmitButton = "Submit";
    dashboardFileImportFormatHelpTextPart1OutsideLink = "To ensure the format is correct, you can";
    dashboardFileImportFormatHelpTextPart2InsideLink = "download a template here.";
    // people
    dashboardPeopleMetrics: { [x in keyof MyanmarDisasterAssessmentSummaryPeople]: string } = {
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
    dashboardSectorHeatMapHeader = "Sectors";
    dashboardSectorHeatmapSeverityHeader = "Severity";
    dashboardSectorHeatmapFactorsHeader = "Factors";
    dashboardSectorHeatmapBasicNeedsHeader = "Basic Needs";
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
    regions = makeObjectWithKeys(getKeys(myanmarRegions), (regionCode) => myanmarRegions[regionCode].name);
    districts = makeObjectWithKeys(getKeys(myanmarDistricts), (districtCode) => myanmarDistricts[districtCode].name);
    townships = makeObjectWithKeys(getKeys(myanmarTownships), (townshipCode) => myanmarTownships[townshipCode].name);
}