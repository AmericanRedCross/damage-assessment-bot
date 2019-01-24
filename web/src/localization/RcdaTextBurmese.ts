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
    siteTitle = "ထိခိုက်မှုဆန်းစစ်အကဲဖြတ်ချက်ဆိုင်ရာ သိမှတ်စရာ အကြောင်းအရာများ";
    signOutButton = "အကောင့်မှထွက်ခွာမည်";
    confirmSignOut = "အကောင့်မှ ထွက်ခွာမည်ဆိုတာ သေချာပါသလား။ မပြီးဆုံးသေးသော အချက်အလက် အစီအရင်ခံစာ မှန်သမျှ သိမ်းဆည်းထားမည်မဟုတ်ပါ။";
    sessionTimeoutMessage = "Your session has expired. Any unfinished chat reports were not saved.";
    // inputs
    languageSelectorLabel = "ဘာသာစကား ရွေးပါ။";
    fileSelectorLabel = "ဝက်(ဘ်)ဆိုက် စာမျက်နှာများကိုဖတ်မည်။";
    dropdownInputSelectAllOption = "အားလုံး";
    // login
    loginHeader = "အကောင့် ဝင်ရောက်မည်။";
    loginFieldsMissingError = "အကောင့်နာမည်နှင့် စကားဝှက်ဖြည့်သွင်းပေးပါ။";
    loginCredentialsInvalidError = "အကောင့်နာမည်နှင့် စကားဝှက် မမှန်ကန်ပါ။";
    loginUnknownError = "မမျှော်လင့်ပဲ အကောင့် ဝင်ရောက်၍ မရပါ။ ကျေးဇူးပြုပြီး နောက်တစ်ခါ ပြန်လည် ကြိုးစားပါ။";
    loginUsernameLabel = "အကောင့်နာမည်";
    loginPasswordLabel = "စကားဝှက်";
    loginPasswordRecoveryLink = "စကားဝှက် မေ့နေပါသလား။";
    loginSubmitButton = "အကောင့် ဝင်ရောက်မည်။";
    loginProviderDescription = "သင်၏ IFRC GO အရည်အချင်းအထောက်အထားများ အသုံးပြုရန်";
    loginRegistrationLink = "အကောင့် စာရင်းသွင်းရန်။";
}

export class RcdaMyanmarTextBurmese implements RcdaMyanmarTextEnglish {
    // dashboard
    dashboardCloseFilterPanelButton = "စီစစ်ချက်များ ပိတ်ရန်";
    dashboardOpenFilterPanelButton = "စီစစ်ချက်များ ဖွင့်ရန်";
    dashboardFileImportButton = "ဖိုင်လ်များ တင်ရန်";
    dashboardDownloadCsvTemplateButton = "CSV ပုံစံ";
    dashboardChatbotLink = "chatbot သို့သွားရန်";
    dashboardRankingSeeAllButton = "အစီရင်ခံထားသည်များ အားလုံးကိုကြည့်ရန်။";
    dashboardSummaryHeadersAllDisasterTypes = "ဘေးအန္တရာယ်ဖြစ်စဉ်အမျိုးအစားအားလုံး";
    dashboardSummaryHeadersAllRegions = "ပြည်နယ်အားလုံး";
    dashboardSectorHeatmapHeader = "အကျဉ်းချုပ်";
    // filter panel
    dashboardFilterHeader = "စီစစ်ချက်များ";
    dashboardFilterDisasterTypeInutLabel = "ဘေးအန္တရာယ်ဖြစ်စဉ်အမျိုးအစား";
    dashboardFilterLocationInputGroupLabel = "တည်နေရာ";
    dashboardFilterRegionInputLabel = "ပြည်နယ်";
    dashboardFilterDistrictInputLabel = "ခရိုင်";
    dashboardFilterTownshipInputLabel = "မြို့နယ်";
    dashboardFilterDateRangeInputGroupLabel = "ရက်စွဲ အပိုင်းအခြား";
    dashboardFilterStartDateInputLabel = "စတင်သည့် ရက်စွဲ";
    dashboardFilterEndDateInputLabel = "ပြီးဆုံးသည့် ရက်စွဲ";
    dashboarFilterApplyButton = "စီစစ်ချက်များအသုံးပြုရန်";
    // file import
    dashboardFileImportHeader = "CSV ဖိုင်လ်တင်ရန်";
    dashboardFileImportNoFileSelectedError = "မည်သည့် ဖိုင်လ်မှ ရွေးချယ်ထားခြင်းမရှိသေးပါ။ ကျေးဇူးပြုပြီး တင်ပို့ရန် ဖိုင်လ်တစ်ခု ရွေးချယ်ပါ။";
    dashboardFileImportSuccessMessage = "ဖိုင်လ်တင်ပို့ခြင်း အောင်မြင်စွာ ပြီးဆုံးပါပြီ။";
    dashboardFileImportFailedUnexpectedly = "File import failed unexpectedly. Please try again later.";
    dashboardFileImportFailedValidation = "File import failed because one or more issues were found. Please fix these issues and try again.";
    dashboardFileImportSelectFileLabel = "ဖိုင်လ်ရွေးချယ်ပါ။";
    dashboardFileImportAcceptedFileTypesHelpText = "မှန်ကန်သည့် ကိန်းဂဏန်းများပါဝင်သော .csv နှင့် .json ဖိုင်လ်များသာ လက်ခံပါမည်။ Excel (.xlsx) ဖိုင်လ်များ လက်မခံပါ။";
    dashboardFileImportErrorBehaviorHelpText = "ထောက်အထားပြုခြင်းဆိုင်ရာ အခက်အခဲများ တွေ့ရှိခဲ့ပါက မည်သည့်အစီအရင်ခံစာများကိုမှ လုပ်ဆောင်မည်မဟုတ်ပါ။ မှားယွင်းချက် အသေးစိတ်ကို အောက်တွင်ဖော်ပြပါမည်။";
    dashboardFileImportSubmitButton = "တင်ပြမည်။";
    dashboardFileImportFormatHelpTextPart1OutsideLink = "ပုံစံအချိုးအစား(format) မှန်ကန်ရန်";
    dashboardFileImportFormatHelpTextPart2InsideLink = "ပုံစံ(template)ကို ဒီမှာ ဒေါင်းလုပ်ဆွဲပါ။";
    // people
    dashboardPeopleMetrics = {
        numberBeforeDisaster: "ဘေးအန္တရာယ်မတိုင်မီ လူဦးရေ",
        numberLeftArea: "ဒေသကိုစွန့် ခွာသွားသည့် လူဦးရေ",
        numberReturned: "ပြန်လည်ရောက်ရှိလာသည့် လူဦးရေ",
        numberStayedInArea: "ဒေသတွင်လက်ရှိနေထိုင်သည့် လူဦးရေ",
        numberAffected: "ထိခိုက်ခံရသည့် လူဦးရေ (စုစုပေါင်း)",
        numberDisplaced: "နေရပ်စွန့်ခွာသည့် လူဦးရေ",
        numberNotDisplaced: "နေရပ်မစွန့်ခွာ ပဲ ထိခိုက်ခံရသည့် လူဦးရေ",
        numberOfCasualties: "ဒဏ်ရာရသည့် လူဦးရေ"
    };
    // rankings    
    dashboardRankingResponseModalitiesTitle = "တုံ့ပြန်မှုဆိုင်ရာ နည်းလမ်းများ";
    dashboardRankingPrioritySectorsTitle = "ဦးစားပေး အခန်းကဏ္ဏများ";
    dashboardRankingVulnerableGroupsTitle = "ထိခိုက်ခံရလွယ်သော အုပ်စုများ";
    dashboardRankingAffectedGroupsTitle = "အကျိုးသက်ရောက်ခံ အုပ်စုများ";
    // sectors    
    dashboardSectorHeatMapHeader = "အခန်းကဏ္ဏများ";
    dashboardSectorHeatmapSeverityHeader = "ပြင်းထန်မှု";
    dashboardSectorHeatmapFactorsHeader = "အကြောင်းအရင်းများ";
    dashboardSectorHeatmapBasicNeedsHeader = "အခြေခံ လိုအပ်ချက်များ";
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