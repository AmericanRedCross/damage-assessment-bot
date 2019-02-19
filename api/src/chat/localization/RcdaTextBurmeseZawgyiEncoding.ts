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
export class RcdaCommonTextBurmeseZawgyiEncoding implements RcdaCommonTextEnglish {
    selectDropdownPlaceholder = "ေရြးပါ...";
    yes = "ဟုတ္သည္/ရွိသည္";
    no = "မဟုတ္ပါ/မရွိပါ";
    askToChangeSelectedLanguage = "ဘာသာစကား ေျပာင္းလဲလိုပါသလား။ ဘာသာစကားေျပာင္းလဲလိုပါက အသစ္ျပန္လည္စတင္မည္ျဖစ္ျပီး မတင္သြင္းရေသးေသာ အစီအရင္ခံခ်က္ ေဒတာ မွန္သမွ် အစမွျပန္စမည္ျဖစ္ပါသည္။"
    formatNumber = (value: number) => value.toString();
}

export class RcdaMyanmarTextBurmeseZawgyiEncoding implements RcdaMyanmarTextEnglish {
    //misc
    chatRedirectToWebAppMessage = "ၾကက္ေျခနီ ေဘးအႏၲရာယ္ ဆန္းစစ္အကဲျဖတ္ခ်က္ chat bot မွျကိုဆုိပါသည္။ ေက်းဇူးျပဳျပီး အေကာင့္၀င္ေရာက္ျပီး အစီအ၇င္ခံစာ တင္ရန္ ကၽြန္ေတာ္တို႕ web app သို႕ဆက္လက္၀င္ေရာက္ပါ။ ";
    redirectButtonText = "အေကာင့္၀င္ေရာက္ရန္ ဒီမွာ ႏွိပ္ပါ။";
    welcomeMessage = "ၾကက္ေျခနီ ေဘးအႏၲရာယ္ ဆန္းစစ္အကဲျဖတ္ခ်က္ chat bot မွျကိုဆုိပါသည္";
    // intro
    promptUserToSelectChatbotFeature = "ကၽြန္ပ္ဘာကူညီေပးရမလဲ";
    startDisasterAssessmentOption = "ေဘးအႏၲရာယ္ ဆိုင္ရာ သတင္းေပးပို႔မႈ စတင္ျပဳလုပ္ပါ။";
    getHelpOption = "အကူအညီရယူရန္";
    invalidChoicePromptRetry = "၀မ္းနည္ပါတယ္၊ ကၽြႏ္ုပ္ နားမလည္ပါ။ ေက်းဇူးျပဳ၍  ေဖာ္ျပထားေသာ စာရင္းထဲမွ တစ္ခုကို ေရြးခ်ယ္ပါ။";
    requestForHelpResponse = "စနစ္ျပဳျပင္ေနဆဲ ျဖစ္ပါသည္။ ေက်းဇူးျပဳျပီး သင္၏ supervisor နွင့္ ဆက္သြယ္ပါ။";
    // submission
    reportSubmissionError = "၀မ္းနည္းပါသည္။ တစ္စံုတစ္ခုမွားယြင္းျပီး သင္၏အစီအရင္ခံစာ တင္သြင္း၍မရပါ။ ေက်းဇူးျပဳ၍ ေနာက္တစ္ၾကိမ္ ၾကိဳးစားပါ။";
    // card buttons
    submitCard = "သိမ္းဆည္းရန္";
    acceptReviewCard = "လက္ခံရန္";
    editReviewCard = "ျပန္လည္ျပင္ဆင္ရန္";
    // report navigation
    askReportOnAnotherSection = "အျခားကိစၥတခုခုကို သတင္းေပးပို႔ လိုပါသလား။";
    askIfReadyToSubmit = "အစီအရင္ခံစာတင္ရန္ အဆင္သင့္ျဖစ္ပါျပီလား။";
    reviewReportOption = "ျပန္လည္ဆန္းစစ္ျခင္း";
    submitReportOption = "တင္သြင္းမည္";
    askWhichSectionToReview = "မည္သည့္အပိုင္းကို ျပန္လည္ဆန္းစစ္ခ်င္ပါသလဲ။";
    confirmReportSubmitted = "ေက်းဇူးတင္ပါတယ္။ သင့္ သတင္းေပးပိုမႈ အား တင္ျပၿပီးျဖစ္ပါသည္။";
    // report info section
    askTownshipName = "မည္သည့္ ၿမိဳ႕နယ္အတြက္ သတင္းပို႔လိုပါသလဲ။";
    askDisasterType = "မည္သည္ ့ေဘးအႏၲရာယ္အမ်ိဳးအစားျဖစ္သနည္း။";
    askGeographicalSettingType = "မည္သည့္ ေဒသတြင္ျဖစ္ပါသနည္း။";
    askToChangeSelectedAdminStack = (townshipName: string) => `လက္ရွိေရြးခ်ယ္ထားေသာ ျမိဳ႕နယ္မွာ **${townshipName}**  ျဖစ္ပါသည္။ ေျပာင္းလဲလိုပါသလား။`;
    askAdminStackRegionName = "သင္ သတင္းေပးပို႕ေနရသည့္ တိုင္းေဒသၾကီး ကို ေရြးခ်ယ္ပါ။";
    askAdminStackDistrictName = "သင္ သတင္းေပးပို႕ေနရသည့္ ခရိုင္ ကို ေရြးခ်ယ္ပါ။";
    askAdminStackTownshipName = "သင္ သတင္းေပးပို႔ေန ရသည့္ ျမိဳ႕နယ္ ကို ေရြးခ်ယ္ပါ။";
    reportCurrentAdminStack = (townshipName: string) => `ျမိဳ႕နယ္ကို **${townshipName}** သတ္မွတ္ျပီးပါျပီ။`;
    // report section selection
    askNextSectionToReport = "မည္သည့္ကိစၥကို သတင္းပို႔လိုပါသနည္း။";
    reportSectionNamePeople = "လူမ်ား";
    reportSectionNameSectors = "က႑မ်ား";
    reportSectionNameRankings = "အဆင့္မ်ား";
    askIfReportAnotherSection = "အျခားကိစၥတခုခုကို သတင္းပို႕လိုပါသလား။";
    // review
    reviewSectionHeader = (sectionName: string) => `ေက်းဇူးျပဳ၍ျပန္လည္သံုးသပ္ရန္ **${sectionName}**`;
    reviewSectionNoResponseValue = "တံု႕ျပန္မႈ မရွိပါ";
    reviewSectorListHeader = "ေရြးခ်ယ္ထားေသာ က႑မ်ားကို ေက်းဇူးျပဳ၍ အတည္ျပဳပါ";
    reviewSectorsReported = "ဤက႑မ်ားကို သင့္ အေနျဖင့္ သတင္း ေပးပို႔ျပီး  ျဖစ္သည္။";
    reviewSectorsNotReported = "ဤက႑မ်ားကို သင့္ အေနျဖင့္ သတင္း မေပးပို႕ရေသးပါ။";
    // people section
    inputLabelNumberOfPeopleBeforeDisaster = "ေဘးအႏၲရာယ္မတိုင္မီ လူဦးေရ";
    inputLabelNumberOfPeopleLeftArea = "ေဒသကိုစြန္႔ခြာသြားသည့္ လူဦးေရ";
    inputLabelNumberOfPeopleReturned = "ျပန္လည္ေရာက္ရွိလာသည့္ လူဦးေရ";
    inputLabelNumberOfPeopleLivingCurrently = "ေဒသတြင္လက္ရွိေနထိုင္သည့္ လူဦးေရ";
    inputLabelNumberOfPeopleAffected = "ထိခိုက္ခံရသည့္ လူဦးေရ (စုစုေပါင္း)";
    inputLabelNumberOfPeopleDisplaced = "ေနရပ္စြန္႕ခြာသည့္ လူဦးေရ";
    inputLabelNumberOfPeopleNotDisplaced = "ေနရပ္မစြန္႕ခြာ ပဲ ထိခိုက္ခံရသည့္ လူဦးေရ";
    inputLabelNumberOfCasualties = "ဒဏ္ရာရသည့္ လူဦးေရ";
    numberInputPlaceholder = "အေရအတြက္";
    // sectors section
    sectorSelectionHeader = "မည့္သည့္က႑ကို သတင္းပို႕နိုင္ပါသလဲ";
    sectorSeverityQuestionHeader = "ျပင္းထန္မႈ";
    sectorFactorsQuestionsHeader = "အေၾကာင္းရင္းမ်ား";
    sectorBasicNeedsQuestionHeader = "အေျခခံလိုအပ္ခ်က္မ်ား";
    sectorBasicNeedsQuestionLabel = "အကူအညီမ်ားကို ထပ္မံမရရွိပါက သင့္အေနျဖင့္ အေျခခံ လိုအပ္ခ်က္မ်ား ကို ေနာက္ ၃ လ အတြင္းတြင္ ရရွိေအာင္ စြမ္းေဆာင္ႏိုင္ရန္ အတြက္ စိုးရိပ္ပူပန္မႈ ရွိပါသလား။";
    // rankings section
    askTop3AffectedGroups = "ဤေဒသတြင္ အကူအညီ ခ်က္ခ်င္း ရရွိရန္ အတြက္ လိုအပ္ေသာ ဦးစားေပးေဆာင္ရြက္ ရမည့္ ထိခိုက္ခံရလြယ္ေသာ အုပ္စု ၃ စု"
    askTop3ResponseModalities = "ဤေဒသတြင္ တုန္႕ျပန္မႈမ်ား ေဆာင္ရြက္ရန္အတြက္  ဦးစားေပးရမည့္ နည္းလမ္း ၃ ခု";
    askTop3PrioritySectors = "ဤေဒသတြင္ အကူအညီ ခ်က္ခ်င္း ရရွိရန္အတြက္ လိုအပ္ေသာ ဦးစားေပး ေဆာင္ရြက္ ရမည့္ က႑ ၃ ခု";
    askTop3VulnerableGroups = "ဤေဒသတြင္ အကူအညီ ခ်က္ခ်င္း ရရွိရန္ အတြက္ လိုအပ္ေသာ ဦးစားေပးေဆာင္ရြက္ ရမည့္ ထိခိုက္ခံရလြယ္ေသာ အုပ္စု ၃ စု";
    rankingSectionResponseModalitiesTitle = "တံု႕ျပန္မႈ နည္းလမ္းမ်ား";
    rankingSectionPrioritySectorsTitle = "ဦးစားေပးက႑မ်ား";
    rankingSectionVulnerableGroupsTitle = "ထိခိုက္ခံရလြယ္ေသာ အုပ္စုမ်ား";
    rankingSectionAffectedGroupsTitle = "ထိခိုက္ခံရေသာအုပ္စုမ်ား";
    responseModalityRankingInputLabel = (rankingNumber: string) => `တံု႕ျပန္မႈ နည္းလမ္း #${rankingNumber}`;
    prioritySectorsRankingInputLabel = (rankingNumber: string) => `ဦးစားေပးက႑ #${rankingNumber}`;
    vulnerableGroupsRankingInputLabel = (rankingNumber: string) => `ထိခိုက္ခံရလြယ္ေသာ အုပ္စု #${rankingNumber}`;
    affectedGroupsRankingInputLabel = (rankingNumber: string) => `ထိခိုက္ခံရေသာအုပ္စု #${rankingNumber}`;
    // value labels
    disasterTypes: RcdaEnumLabels<DisasterTypes> = {
        [DisasterTypes.CarAccident]: "ယာဥ္မေတာ္မဆမႈ",
        [DisasterTypes.Cyclone]: "ဆိုင္ကလုန္း",
        [DisasterTypes.Earthquake]: "ငလ်င္",
        [DisasterTypes.Explosion]: "ေပါက္ကြဲမႈ",
        [DisasterTypes.Fire]: "မီးေလာင္မႈ",
        [DisasterTypes.Flood]: "ေရႀကီးျခင္း",
        [DisasterTypes.IDP]: "ေနရပ္စြန္႕ခြာသူမ်ား",
        [DisasterTypes.Landslide]: "ေျမၿပိဳျခင္း",
        [DisasterTypes.Other]: "အျခား",
        [DisasterTypes.Shooting]: "ပစ္ခတ္မႈ",
        [DisasterTypes.StrongWind]: "ေလျပင္းတုိက္ခတ္မႈ",
        [DisasterTypes.Tornado]: "ေလဆင္နွာေမာင္း",
        [DisasterTypes.Wreck]: "႐ုတ္တရက္ပ်က္စီးမႈ"
    };
    geographicalSettings: RcdaEnumLabels<GeographicalSettings> = {
        [GeographicalSettings.Rural]: "ေက်းလက္ေဒသ",
        [GeographicalSettings.Urban]: "ၿမိဳ႕ျပ",
        [GeographicalSettings.SemiUrban]: "အလယ္အလတ္ၿမိဳ႕ျပ"
    };
    sectors: RcdaEnumLabels<Sectors> = {
        [Sectors.Health]: "က်န္းမာေရး",
        [Sectors.Food]: "အစားအစာ",
        [Sectors.Wash]: "သန္႕ရွင္းမႈ",
        [Sectors.ShelterNFI]: "အမိုးအကာ / အစားအစာ မဟုတ္ေသာ ပစၥည္းမ်ား",
        [Sectors.Protection]: "ကာကြယ္မႈ",
        [Sectors.Education]: "ပညာေရး",
        [Sectors.Livelihood]: "အသက္ေမြး၀မ္းေၾကာင္း",
        [Sectors.Other]: "အျခား"
    };
    sectorFactors: RcdaEnumLabels<SectorFactors> = {
        [SectorFactors.Access]: "လက္လွမ္းမွီႏိုင္မႈ",
        [SectorFactors.Availability]: "ရရွိနိုင္မႈ",
        [SectorFactors.Quality]: "အရည္အေသြး",
        [SectorFactors.Use]: "အသံုးျပဳမႈ",
    };
    sectorBasicNeedsConcernScale: RcdaEnumLabels<SectorBasicNeedsConcernScale> = {
        [1]: "ယခုလိုအပ္ခ်က္မ်ားအတြက္ လံုး၀ပူပန္ျခင္းမရွိေသာ လူဦးေရ",
        [2]: "စိုးရိမ္ပူပန္ေသာ္လည္း ကိုင္တြယ္ေျဖရွင္းနိုင္မည္ဟု ယံုၾကည္ေသာ လူဦးေရ",
        [3]: "မိသားစု၀င္အခ်ိဳ႕ (သို႕) အားလံုး ၏ ဥစၥာပစၥည္း အတြက္ စိုးရိမ္ေနၾကၿပီး ျပန္လည္ေျဖရွင္းရန္ မေသခ်ာေသာ လူဦးေရ",
        [4]: "မိသားစု၀င္အခ်ိဳ႕ (သို႕) အားလံုး ၏ က်န္းမာေရး အတြက္ စိုးရိမ္ေနၾကေသာ လူဦးေရ",
        [5]: "မိသားစု၀င္အခ်ိဳ႕ (သို႕) အားလံုး ၏ ဘ၀အတြက္ စိုးရိမ္ေနၾကေသာ လူဦးေရ"
    };
    sectorFactorImpactScale: RcdaEnumLabels<SectorFactorImpactScale> = {
        [0]: "အကိ်ဳးသက္ေရာက္မႈလံုး၀မရွိေသာ က႑",
        [1]: "အနည္းငယ္အက်ိဳးသက္ေရာက္မႈရွိေသာ က႑",
        [2]: "အလယ္အလတ္အက်ိဳးသက္ေရာက္မႈရွိေသာက႑",
        [3]: "ႀကီးမားေသာ အက်ိဳးသက္ေရာက္မႈရွိေသာ က႑"
    };
    sectorSeverityScale: RcdaEnumLabels<SectorSeverityScale> = {
        [1]: "စိုးရိမ္မႈ မရွိပါ - ထိန္းခ်ဳပ္မႈ ေအာက္တြင္ ရွိေသာ အေျခအေန",
        [2]: "စိုးရိမ္မႈ ေသာ အေျခအေန - ေစာင့္ၾကည့္ေလ့လာရန္",
        [3]: "ေထာက္ပံ့မႈ မလံုေလာက္ေသာေၾကာင့္  ခံစားေနရေသာ လူဦးေရ (ကုန္ပစၥည္းမ်ား (သို႕) ၀န္ေဆာင္မႈမ်ား ေထာက္ပံ့ေပးမႈ)",
        [4]: "ေထာက္ပံ့မႈ မလံုေလာက္ေသာေၾကာင့္  ေသဆံုး ႏိုင္ေျခရွိေသာ လူဦးေရ (ကုန္ပစၥည္းမ်ား (သို႕) ၀န္ေဆာင္မႈမ်ား ေထာက္ပံ့ေပးမႈ)",
        [5]: "ေထာက္ပံ့မႈ မလံုေလာက္ေသာေၾကာင့္  ေသဆံုး မည့္ လူဦးေရ (ကုန္ပစၥည္းမ်ား (သို႕) ၀န္ေဆာင္မႈမ်ား ေထာက္ပံ့ေပးမႈ)"
    };
    affectedGroups: RcdaEnumLabels<AffectedGroups> = {
        [AffectedGroups.DisplacedIdp]: "ေနရပ္စြန္႕ခြာသူမ်ား",
        [AffectedGroups.DisplacedRefugeesAndAsylumSeekers]: "ေနရပ္စြန္႕ခြာျပီး ဒုကၡခံစားရသူမ်ား ႏွင့္   ခိုလံႈခြင့္ေတာင္းသူမ်ား",
        [AffectedGroups.DisplacedReturnees]: "ေနရပ္စြန္႕ခြားျပီး ျပန္လည္ေရာက္ရွိသူမ်ား",
        [AffectedGroups.DisplacedOthers]: "တျခားေသာ စိုးရိပ္ပူပန္မႈေၾကာင့္ ေနရပ္စြန္႕ခြာသူမ်ား",
        [AffectedGroups.NonDisplacedHost]: "ေနရပ္မစြန္႕ခြာေသာ အိမ္ရွင္မ်ား",
        [AffectedGroups.NonDisplacedNonHost]: "ေနရပ္မစြန္႕ခြာေသာ အိမ္ရွင္မဟုတ္သူမ်ား"
    };
    responseModalities: RcdaEnumLabels<ResponseModalities> = {
        [ResponseModalities.Foods]: "အစားအစာမ်ား",
        [ResponseModalities.HygeineItems]: "တကိုယ္ေရ သန္႕ရွင္းေရး အသံုးအေဆာင္မ်ား",
        [ResponseModalities.Misc]: "အေထြေထြ",
        [ResponseModalities.NFIs]: "အစားအစာ မဟုတ္ေသာ ပစၥည္းမ်ား",
        [ResponseModalities.RestoringFamilyLinks]: "မိသားစု ျပန္လည္္ဆက္သြယ္ေရး",
        [ResponseModalities.Shelter]: "ေနအိမ္အမိုးအကာ"
    };
    vulnerableGroups: RcdaEnumLabels<VulnerableGroups> = {
        [VulnerableGroups.Children]: "ကေလးသူငယ္မ်ား",
        [VulnerableGroups.ChronicallyIll]: "နာတာရွည္ မက်န္းမာေသာသူမ်ား",
        [VulnerableGroups.Elderly]: "သက္ၾကီးရြယ္အိုမ်ား",
        [VulnerableGroups.FemaleHeadOfHousehold]: "အမ်ိဳးသမီး ဦးေဆာင္ေသာ အိမ္ေထာင္စု",
        [VulnerableGroups.LactatingMothers]: "ႏို႕တုိက္မိခင္မ်ား",
        [VulnerableGroups.MentallyDisabled]: "စိတ္ပိုင္းဆိုင္ရာ မသန္စြမ္းသူမ်ား",
        [VulnerableGroups.MothersWithInfants]: "ေမြးကင္းစ ကေလးမိခင္မ်ား",
        [VulnerableGroups.PhysicallyDisabled]: "ရုပ္ပိုင္းဆိုင္ရာ မသန္စြမ္းသူမ်ား",
        [VulnerableGroups.PregnantWomen]: "ကိုယ္၀န္ေဆာင္ အမ်ိုဳးသမီးမ်ား",
        [VulnerableGroups.Sick]: "နာမက်န္းျဖစ္ျခင္း",
        [VulnerableGroups.SingleHeadedHousehold]: "တစ္ဦးတည္း ဦးေဆာင္ေသာ အိမ္ေထာင္စု"
    };
    regions = makeObjectWithKeys(getKeys(myanmarRegions), (regionCode) => myanmarRegions[regionCode].nameBurmeseZawgyi);
    districts = makeObjectWithKeys(getKeys(myanmarDistricts), (districtCode) => myanmarDistricts[districtCode].nameBurmeseZawgyi);
    townships = makeObjectWithKeys(getKeys(myanmarTownships), (townshipCode) => myanmarTownships[townshipCode].nameBurmeseZawgyi);
}