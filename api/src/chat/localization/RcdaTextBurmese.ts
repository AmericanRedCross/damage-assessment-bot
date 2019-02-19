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
    selectDropdownPlaceholder = "ရွေးပါ...";
    yes = "ဟုတ်သည်/ရှိသည်";
    no = "မဟုတ်ပါ/မရှိပါ";
    // TODO: The below text was obtained from Google translate. Need a real translation
    askToChangeSelectedLanguage = "ဘာသာစကား ပြောင်းလဲလိုပါသလား။ ဘာသာစကားပြောင်းလဲလိုပါက အသစ်ပြန်လည်စတင်မည်ဖြစ်ပြီး မတင်သွင်းရသေးသော အစီအရင်ခံချက် ဒေတာ မှန်သမျှ အစမှပြန်စမည်ဖြစ်ပါသည်။"
    formatNumber = (value: number) => value.toString();
}

export class RcdaMyanmarTextBurmese implements RcdaMyanmarTextEnglish {
    //misc
    chatRedirectToWebAppMessage = "ကြက်ခြေနီ ဘေးအန္တရာယ် ဆန်းစစ်အကဲဖြတ်ချက် chat bot မှကြိုဆိုပါသည်။ ကျေးဇူးပြုပြီး အကောင့်ဝင်ရောက်ပြီး အစီအရင်ခံစာ တင်ရန် ကျွန်တော်တို့ web app သို့ဆက်လက်ဝင်ရောက်ပါ။";
    redirectButtonText = "အကောင့်ဝင်ရောက်ရန် ဒီမှာ နှိပ်ပါ။";
    welcomeMessage = "ကြက်ခြေနီ ဘေးအန္တရာယ် ဆန်းစစ်အကဲဖြတ်ချက် chat bot မှကြိုဆိုပါသည်";
    // intro
    promptUserToSelectChatbotFeature = "ကျွန်ပ်ဘာကူညီပေးရမလဲ";
    startDisasterAssessmentOption = "ဘေးအန္တရာယ် ဆိုင်ရာ သတင်းပေးပို့မှု စတင်ပြုလုပ်ပါ။";
    getHelpOption = "အကူအညီရယူရန်";
    invalidChoicePromptRetry = "ဝမ်းနည်ပါတယ်၊ ကျွန်ုပ် နားမလည်ပါ။ ကျေးဇူးပြု၍  ဖော်ပြထားသော စာရင်းထဲမှ တစ်ခုကို ရွေးချယ်ပါ။";
    requestForHelpResponse = "စနစ်ပြုပြင်နေဆဲ ဖြစ်ပါသည်။ ကျေးဇူးပြုပြီး သင်၏ supervisor နှင့် ဆက်သွယ်ပါ။";
    // submission
    reportSubmissionError = "ဝမ်းနည်းပါသည်။ တစ်စုံတစ်ခုမှားယွင်းပြီး သင်၏အစီအရင်ခံစာ တင်သွင်း၍မရပါ။ ကျေးဇူးပြု၍ နောက်တစ်ကြိမ် ကြိုးစားပါ။";
    // card buttons
    submitCard = "သိမ်းဆည်းရန်";
    acceptReviewCard = "လက်ခံရန်";
    editReviewCard = "ပြန်လည်ပြင်ဆင်ရန်";
    // report navigation
    askReportOnAnotherSection = "အခြားကိစ္စတခုခုကို သတင်းပေးပို့ လိုပါသလား။";
    askIfReadyToSubmit = "အစီအရင်ခံစာတင်ရန် အဆင်သင့်ဖြစ်ပါပြီလား။";
    reviewReportOption = "ပြန်လည်ဆန်းစစ်ခြင်း";
    submitReportOption = "တင်သွင်းမည်";
    askWhichSectionToReview = "မည်သည့်အပိုင်းကို ပြန်လည်ဆန်းစစ်ချင်ပါသလဲ။";
    confirmReportSubmitted = "ကျေးဇူးတင်ပါတယ်။ သင့် သတင်းပေးပိုမှု အား တင်ပြပြီးဖြစ်ပါသည်။";
    // report info section
    askTownshipName = "မည်သည့် မြို့နယ်အတွက် သတင်းပို့လိုပါသလဲ။";
    askDisasterType = "မည်သည့် ဘေးအန္တရာယ်အမျိုးအစားဖြစ်သနည်း။";
    askGeographicalSettingType = "မည်သည့် ဒေသတွင်ဖြစ်ပါသနည်း။";
    askToChangeSelectedAdminStack = (townshipName: string) => `လက်ရှိရွေးချယ်ထားသော မြို့နယ်မှာ **${townshipName}** ဖြစ်ပါသည်။ ပြောင်းလဲလိုပါသလား။`;
    askAdminStackRegionName = "သင် သတင်းပေးပို့နေရသည့် တိုင်းဒေသကြီး ကို ရွေးချယ်ပါ။";
    askAdminStackDistrictName = "သင် သတင်းပေးပို့နေရသည့် ခရိုင် ကို ရွေးချယ်ပါ။";
    askAdminStackTownshipName = "သင် သတင်းပေးပို့နေ ရသည့် မြို့နယ် ကို ရွေးချယ်ပါ။";
    reportCurrentAdminStack = (townshipName: string) => `မြို့နယ်ကို **${townshipName}** သတ်မှတ်ပြီးပါပြီ။`;
    // report section selection
    askNextSectionToReport = "မည်သည့် ကိစ္စကို သတင်းပို့လိုပါသနည်း။";
    reportSectionNamePeople = "လူများ";
    reportSectionNameSectors = "ကဏ္ဍများ";
    reportSectionNameRankings = "အဆင့်များ";
    askIfReportAnotherSection = "အခြားကိစ္စတခုခုကို သတင်းပို့လိုပါသလား။";
    // review
    reviewSectionHeader = (sectionName: string) => `ကျေးဇူးပြု၍ပြန်လည်သုံးသပ်ရန် **${sectionName}**`;
    reviewSectionNoResponseValue = "တုံ့ပြန်မှု မရှိပါ";
    reviewSectorListHeader = "ရွေးချယ်ထားသော ကဏ္ဍများကို ကျေးဇူးပြု၍ အတည်ပြုပါ";
    reviewSectorsReported = "ဤကဏ္ဍများကို သင့် အနေဖြင့် သတင်း ပေးပို့ပြီး  ဖြစ်သည်။ :";
    reviewSectorsNotReported = "ဤကဏ္ဍများကို သင့် အနေဖြင့် သတင်း မပေးပို့ရသေးပါ။ :";
    // people section
    inputLabelNumberOfPeopleBeforeDisaster = "ဘေးအန္တရာယ်မတိုင်မီ လူဦးရေ";
    inputLabelNumberOfPeopleLeftArea = "ဒေသကိုစွန့် ခွာသွားသည့် လူဦးရေ";
    inputLabelNumberOfPeopleReturned = "ပြန်လည်ရောက်ရှိလာသည့် လူဦးရေ";
    inputLabelNumberOfPeopleLivingCurrently = "ဒေသတွင်လက်ရှိနေထိုင်သည့် လူဦးရေ";
    inputLabelNumberOfPeopleAffected = "ထိခိုက်ခံရသည့် လူဦးရေ (စုစုပေါင်း)";
    inputLabelNumberOfPeopleDisplaced = "နေရပ်စွန့်ခွာသည့် လူဦးရေ";
    inputLabelNumberOfPeopleNotDisplaced = "နေရပ်မစွန့်ခွာ ပဲ ထိခိုက်ခံရသည့် လူဦးရေ";
    inputLabelNumberOfCasualties = "ဒဏ်ရာရသည့် လူဦးရေ";
    numberInputPlaceholder = "အရေအတွက်";
    // sectors section
    sectorSelectionHeader = "မည်သည့်ကဏ္ဍကို သတင်းပို့နိုင်ပါသလဲ";
    sectorSeverityQuestionHeader = "ပြင်းထန်မှု";
    sectorFactorsQuestionsHeader = "အကြောင်းရင်းများ";
    sectorBasicNeedsQuestionHeader = "အခြေခံလိုအပ်ချက်များ";
    sectorBasicNeedsQuestionLabel = "အကူအညီများကို ထပ်မံမရရှိပါက သင့်အနေဖြင့် အခြေခံ လိုအပ်ချက်များ ကို နောက် ၃ လ အတွင်းတွင် ရရှိအောင် စွမ်းဆောင်နိုင်ရန် အတွက် စိုးရိပ်ပူပန်မှု ရှိပါသလား။";
    // rankings section
    askTop3AffectedGroups = "ဤဒေသတွင် အကူအညီ ချက်ချင်း ရရှိရန် အတွက် လိုအပ်သော ဦးစားပေးဆောင်ရွက် ရမည့် ထိခိုက်ခံရလွယ်သော အုပ်စု ၃ စု"
    askTop3ResponseModalities = "ဤဒေသတွင် တုန့် ပြန်မှုများ ဆောင်ရွက်ရန်အတွက်  ဦးစားပေးရမည့် နည်းလမ်း ၃ ခု";
    askTop3PrioritySectors = "ဤဒေသတွင် အကူအညီ ချက်ချင်း ရရှိရန်အတွက် လိုအပ်သော ဦးစားပေး ဆောင်ရွက် ရမည့် ကဏ္ဍ ၃ ခု";
    askTop3VulnerableGroups = "ဤဒေသတွင် အကူအညီ ချက်ချင်း ရရှိရန် အတွက် လိုအပ်သော ဦးစားပေးဆောင်ရွက် ရမည့် ထိခိုက်ခံရလွယ်သော အုပ်စု ၃ စု";
    rankingSectionResponseModalitiesTitle = "တုံ့ပြန်မှု နည်းလမ်းများ";
    rankingSectionPrioritySectorsTitle = "ဦးစားပေးကဏ္ဍများ";
    rankingSectionVulnerableGroupsTitle = "ထိခိုက်ခံရလွယ်သော အုပ်စုများ";
    rankingSectionAffectedGroupsTitle = "ထိခိုက်ခံရသောအုပ်စုများ";
    responseModalityRankingInputLabel = (rankingNumber: string) => `တုံ့ပြန်မှု နည်းလမ်း #${rankingNumber}`;
    prioritySectorsRankingInputLabel = (rankingNumber: string) => `ဦးစားပေးကဏ္ဍ #${rankingNumber}`;
    vulnerableGroupsRankingInputLabel = (rankingNumber: string) => `ထိခိုက်ခံရလွယ်သော အုပ်စု #${rankingNumber}`;
    affectedGroupsRankingInputLabel = (rankingNumber: string) => `ထိခိုက်ခံရသောအုပ်စု #${rankingNumber}`;
    // value labels
    disasterTypes: RcdaEnumLabels<DisasterTypes> = {
        [DisasterTypes.CarAccident]: "ယာဉ်မတော်မဆမှု",
        [DisasterTypes.Cyclone]: "ဆိုင်ကလုန်း",
        [DisasterTypes.Earthquake]: "ငလျင်",
        [DisasterTypes.Explosion]: "ပေါက်ကွဲမှု",
        [DisasterTypes.Fire]: "မီးလောင်မှု",
        [DisasterTypes.Flood]: "ရေကြီးခြင်း",
        [DisasterTypes.IDP]: "နေရပ်စွန့်ခွာသူများ",
        [DisasterTypes.Landslide]: "မြေပြိုခြင်း",
        [DisasterTypes.Other]: "အခြား",
        [DisasterTypes.Shooting]: "ပစ်ခတ်မှု",
        [DisasterTypes.StrongWind]: "လေပြင်းတိုက်ခတ်မှု",
        [DisasterTypes.Tornado]: "လေဆင်နှာမောင်း",
        [DisasterTypes.Wreck]: "ရုတ်တရက်ပျက်စီးမှု"
    };
    geographicalSettings: RcdaEnumLabels<GeographicalSettings> = {
        [GeographicalSettings.Rural]: "ကျေးလက်ဒေသ",
        [GeographicalSettings.Urban]: "မြို့ပြ",
        [GeographicalSettings.SemiUrban]: "အလယ်အလတ်မြို့ပြ"
    };
    sectors: RcdaEnumLabels<Sectors> = {
        [Sectors.Health]: "ကျန်းမာရေး",
        [Sectors.Food]: "အစားအစာ",
        [Sectors.Wash]: "သန့်ရှင်းမှု",
        [Sectors.ShelterNFI]: "အမိုးအကာ / အစားအစာ မဟုတ်သော ပစ္စည်းများ",
        [Sectors.Protection]: "ကာကွယ်မှု",
        [Sectors.Education]: "ပညာရေး",
        [Sectors.Livelihood]: "အသက်မွေးဝမ်းကြောင်း",
        [Sectors.Other]: "အခြား"
    };
    sectorFactors: RcdaEnumLabels<SectorFactors> = {
        [SectorFactors.Access]: "လက်လှမ်းမှီနိုင်မှု",
        [SectorFactors.Availability]: "ရရှိနိုင်မှု",
        [SectorFactors.Quality]: "အရည်အသွေး",
        [SectorFactors.Use]: "အသုံးပြုမှု",
    };
    sectorBasicNeedsConcernScale: RcdaEnumLabels<SectorBasicNeedsConcernScale> = {
        [1]: "ယခုလိုအပ်ချက်များအတွက် လုံးဝပူပန်ခြင်းမရှိသော လူဦးရေ",
        [2]: "စိုးရိမ်ပူပန်သော်လည်း ကိုင်တွယ်ဖြေရှင်းနိုင်မည်ဟု ယုံကြည်သော လူဦးရေ",
        [3]: "မိသားစုဝင်အချို့ (သို့) အားလုံး ၏ ဥစ္စာပစ္စည်း အတွက် စိုးရိမ်နေကြပြီး ပြန်လည်ဖြေရှင်းရန် မသေချာသော လူဦးရေ",
        [4]: "မိသားစုဝင်အချို့ (သို့) အားလုံး ၏ ကျန်းမာရေး အတွက် စိုးရိမ်နေကြသော လူဦးရေ",
        [5]: "မိသားစုဝင်အချို့ (သို့) အားလုံး ၏ ဘဝအတွက် စိုးရိမ်နေကြသော လူဦးရေ"
    };
    sectorFactorImpactScale: RcdaEnumLabels<SectorFactorImpactScale> = {
        [0]: "အကျိုးသက်ရောက်မှုလုံးဝမရှိသော ကဏ္ဍ",
        [1]: "အနည်းငယ်အကျိုးသက်ရောက်မှုရှိသော ကဏ္ဍ",
        [2]: "အလယ်အလတ်အကျိုးသက်ရောက်မှုရှိသောကဏ္ဍ",
        [3]: "ကြီးမားသော အကျိုးသက်ရောက်မှုရှိသော ကဏ္ဍ"
    };
    sectorSeverityScale: RcdaEnumLabels<SectorSeverityScale> = {
        [1]: "စိုးရိမ်မှု မရှိပါ - ထိန်းချုပ်မှု အောက်တွင် ရှိသော အခြေအနေ",
        [2]: "စိုးရိမ်မှု သော အခြေအနေ - စောင့်ကြည့်လေ့လာရန်",
        [3]: "ထောက်ပံ့မှု မလုံလောက်သောကြောင့်  ခံစားနေရသော လူဦးရေ (ကုန်ပစ္စည်းများ (သို့) ဝန်ဆောင်မှုများ ထောက်ပံ့ပေးမှု)",
        [4]: "ထောက်ပံ့မှု မလုံလောက်သောကြောင့်  သေဆုံး နိုင်ခြေရှိသော လူဦးရေ (ကုန်ပစ္စည်းများ (သို့) ဝန်ဆောင်မှုများ ထောက်ပံ့ပေးမှု)",
        [5]: "ထောက်ပံ့မှု မလုံလောက်သောကြောင့်  သေဆုံး မည့် လူဦးရေ (ကုန်ပစ္စည်းများ (သို့) ဝန်ဆောင်မှုများ ထောက်ပံ့ပေးမှု)"
    };
    affectedGroups: RcdaEnumLabels<AffectedGroups> = {
        [AffectedGroups.DisplacedIdp]: "နေရပ်စွန့်ခွာသူများ",
        [AffectedGroups.DisplacedRefugeesAndAsylumSeekers]: "နေရပ်စွန့်ခွာပြီး ဒုက္ခခံစားရသူများ နှင့်   ခိုလှုံခွင့်တောင်းသူများ",
        [AffectedGroups.DisplacedReturnees]: "နေရပ်စွန့်ခွားပြီး ပြန်လည်ရောက်ရှိသူများ",
        [AffectedGroups.DisplacedOthers]: "တခြားသော စိုးရိပ်ပူပန်မှုကြောင့် နေရပ်စွန့်ခွာသူများ",
        [AffectedGroups.NonDisplacedHost]: "နေရပ်မစွန့်ခွာသော အိမ်ရှင်မဟုတ်သူများ",
        [AffectedGroups.NonDisplacedNonHost]: "နေရပ်မစွန့်ခွာသော အိမ်ရှင်မဟုတ်သူများ"
    };
    responseModalities: RcdaEnumLabels<ResponseModalities> = {
        [ResponseModalities.Foods]: "အစားအစာများ",
        [ResponseModalities.HygeineItems]: "တကိုယ်ရေ သန့်ရှင်းရေး အသုံးအဆောင်များ",
        [ResponseModalities.Misc]: "အထွေထွေ",
        [ResponseModalities.NFIs]: "အစားအစာ မဟုတ်သော ပစ္စည်းများ",
        [ResponseModalities.RestoringFamilyLinks]: "မိသားစု ပြန်လည်ဆက်သွယ်ရေး",
        [ResponseModalities.Shelter]: "နေအိမ်အမိုးအကာ"
    };
    vulnerableGroups: RcdaEnumLabels<VulnerableGroups> = {
        [VulnerableGroups.Children]: "ကလေးသူငယ်များ",
        [VulnerableGroups.ChronicallyIll]: "နာတာရှည် မကျန်းမာသောသူများ",
        [VulnerableGroups.Elderly]: "သက်ကြီးရွယ်အိုများ",
        [VulnerableGroups.FemaleHeadOfHousehold]: "အမျိုးသမီး ဦးဆောင်သော အိမ်ထောင်စု",
        [VulnerableGroups.LactatingMothers]: "နို့တိုက်မိခင်များ",
        [VulnerableGroups.MentallyDisabled]: "စိတ်ပိုင်းဆိုင်ရာ မသန်စွမ်းသူများ",
        [VulnerableGroups.MothersWithInfants]: "မွေးကင်းစ ကလေးမိခင်များ",
        [VulnerableGroups.PhysicallyDisabled]: "ရုပ်ပိုင်းဆိုင်ရာ မသန်စွမ်းသူများ",
        [VulnerableGroups.PregnantWomen]: "ကိုယ်ဝန်ဆောင် အမျိုးသမီးများ",
        [VulnerableGroups.Sick]: "နာမကျန်းဖြစ်ခြင်း",
        [VulnerableGroups.SingleHeadedHousehold]: "တစ်ဦးတည်း ဦးဆောင်သော အိမ်ထောင်စု"
    };
    regions = makeObjectWithKeys(getKeys(myanmarRegions), (regionCode) => myanmarRegions[regionCode].nameBurmese);
    districts = makeObjectWithKeys(getKeys(myanmarDistricts), (districtCode) => myanmarDistricts[districtCode].nameBurmese);
    townships = makeObjectWithKeys(getKeys(myanmarTownships), (townshipCode) => myanmarTownships[townshipCode].nameBurmese);
}