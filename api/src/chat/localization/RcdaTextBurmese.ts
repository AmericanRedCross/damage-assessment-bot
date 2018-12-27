import { makeObjectWithKeys, getKeys } from "@common/utils/objectHelpers";
import { myanmarRegions, myanmarDistricts, myanmarTownships } from "@common/system/countries/myanmar/MyanmarAdminStack";
import RcdaEnumLabels from "@/chat/localization/utils/RcdaEnumLabels";
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
import { RcdaCommonTextEnglish, RcdaMyanmarTextEnglish } from "@/chat/localization/RcdaTextEnglish";

// This specifies text for common functionality that is not specific to any country, such as welcome dialogues, generic labels, etc.
export class RcdaCommonTextBurmese implements RcdaCommonTextEnglish {
    askPreferredLanguage = "Please select a language";
    selectDropdownPlaceholder = "Choose...";
    yes = "Yes";
    no = "No";
    formatNumber = (value: number) => value.toString();
}

export class RcdaMyanmarTextBurmese implements RcdaMyanmarTextEnglish {
    // intro
    promptUserToSelectChatbotFeature = "What can I assist with?";
    startDisasterAssessmentOption = "Start reporting on a disaster";
    getHelpOption = "Help";
    invalidChoicePromptRetry = "Sorry, I didn't understand that. Please select one of the listed options.";
    choiceNotYetSupportedPromptRetry = "Not yet implemented, please select another option";
    // card buttons
    submitCard = "Save";
    acceptReviewCard = "Accept";
    editReviewCard = "Edit";
    // report navigation
    askReportOnAnotherSection = "Would you like to report on anything else?";
    confirmReportSubmitted = "Thank you, your report has been submitted";
    // report info section
    askTownshipName = "What township are you reporting on?";
    askDisasterType = "What is the disaster type?";
    askGeographicalSettingType = "What is the setting?";
    tellCurrentAdminStack = (currentAdminStack: string) => `The current admin stack selected is - **${this.townships[currentAdminStack]}**. Do you want to change it?`;
    askAdminStackRegionName = "Please select the **Region** you are reporting on -";
    askAdminStackDistrictName = "Please select the **District** you are reporting on -";
    askAdminStackTownshipName = "Please select the **Township** you are reporting on -";
    reportCurrentAdminStack = (currentAdminStack:string) => `You are now reporting on Admin Stack - **${this.townships[currentAdminStack]}**`;
    // report section selection
    askNextSectionToReport = "What do you want to report on?";
    reportSectionNamePeople = "People";
    reportSectionNameSectors = "Sectors";
    reportSectionNameRankings = "Rankings";
    askIfReportAnotherSection = "Would you like to report on anything else?";
    // review
    reviewSectionHeader = (sectionName: string) => `Please review **${sectionName}**`;
    reviewSectionNoResponseValue = "No Response";
    reviewSectorListHeader = "Please confirm the selected **Sectors**";
    reviewSectorsReported = "You **have** reported on these sectors:";
    reviewSectorsNotReported = "You **have not** reported on these sectors:";
    // people section
    inputLabelNumberOfPeopleBeforeDisaster = "Number of people before disaster";
    inputLabelNumberOfPeopleLeftArea = "Number of people who have left the area";
    inputLabelNumberOfPeopleReturned = "Number of people who have returned";
    inputLabelNumberOfPeopleLivingCurrently = "Number of people currently living in the area";
    inputLabelNumberOfPeopleAffected = "Number of people affected (SUM)";
    inputLabelNumberOfPeopleDisplaced = "Number of people displaced";
    inputLabelNumberOfPeopleNotDisplaced = "Number of people affected non-displaced";
    inputLabelNumberOfCasualties = "Number of casualties";
    // sectors section
    sectorSelectionHeader = "Please select the **Sectors** to report";
    sectorSeverityQuestionHeader = "Severity";
    sectorFactorsQuestionsHeader = "Factors";
    sectorBasicNeedsQuestionHeader = "Basic Needs";
    sectorBasicNeedsQuestionLabel = "Without additional assistance, are you worried about your ability to meet your basic needs for this sector in the next 3 months?";
    // rankings section
    askTop3AffectedGroups = "Who are the top 3 affected groups that require immediate assistance in this area?"
    askTop3ResponseModalities = "What are the top 3 response modalities you would favour?";
    askTop3PrioritySectors = "What are the top 3 priority sectors requiring immediate assistance in this area?";
    askTop3VulnerableGroups = "What are the top 3 vulnerable groups requiring immediate assistance in this area?";
    rankingSectionResponseModalitiesTitle = "Response Modalities";
    rankingSectionPrioritySectorsTitle = "Priority Sectors";
    rankingSectionVulnerableGroupsTitle = "Vulnerable Groups";
    rankingSectionAffectedGroupsTitle = "Affected Groups";
    responseModalityRankingInputLabel = (rankingNumber: string) => `Response Modality #${rankingNumber}`;
    prioritySectorsRankingInputLabel = (rankingNumber: string) => `Priority Sector #${rankingNumber}`;
    vulnerableGroupsRankingInputLabel = (rankingNumber: string) => `Vulnerable Group #${rankingNumber}`;
    affectedGroupsRankingInputLabel = (rankingNumber: string) => `Affected Group #${rankingNumber}`;
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