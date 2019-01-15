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
    signOutButton = "ဆိုင်းအောက်";
    confirmSignOut = "သငျသညျအထဲကလက်မှတ်ထိုးရန်လိုခငျြတာသေချာလား? မဆိုမပြီးဆုံးသေးသောချက်တင်အစီရင်ခံစာများကယ်တင်ခြင်းသို့ရောက်လိမ့်မည်မဟုတ်။";
    // inputs
    languageSelectorLabel = "ဘာသာစကားများကိုရွေးချယ်ပါ";
    fileSelectorLabel = "ရှေးခယျြ";
    dropdownInputSelectAllOption = "အားလုံး";
    // login
    loginHeader = "လော့ဂ်အင်";
    loginFieldsMissingError = "ဆိုင်းအောက်";
    loginCredentialsInvalidError = "ဆိုင်းအောက်";
    loginUnknownError = "ဆိုင်းအောက်";
    loginUsernameLabel = "နာမတျောကို";
    loginPasswordLabel = "စကားဝှက်ကို";
    loginPasswordRecoveryLink = "စကားဝှက်ကိုမေ့နေပါသလား?";
    loginSubmitButton = "လော့ဂ်အင်";
    loginProviderDescription = "ဆိုင်းအောက်";
    loginRegistrationLink = "ဆိုင်းအောက်";
}

export class RcdaMyanmarTextBurmese implements RcdaMyanmarTextEnglish {
    // dashboard
    dashboardCloseFilterPanelButton = "အနီးကပ်စိစစ်မှုများ";
    dashboardOpenFilterPanelButton = "ပွင့်လင်းစိစစ်မှုများ";
    dashboardFileImportButton = "လွှတ်တင်ခြင်း";
    dashboardDownloadCsvTemplateButton = "လွှတ်တင်ခြင်း";
    dashboardChatbotLink = "စကားပြောဆိုမှုလျှောက်လွှာကိုသွားပါ";
    dashboardRankingSeeAllButton = "အားလုံးနားဆင်နိုင်ပါတယ်ကိုကြည့်ပါ";
    dashboardSummaryHeadersAllDisasterTypes = "အားလုံးဘေးအန္တရာယ်အမျိုးအစားများ";
    dashboardSummaryHeadersAllRegions = "အားလုံးဘေးအန္တရာယ်အမျိုးအစားများ";
    dashboardSectorHeatmapHeader = "ကဏ္ဍများ";
    // filter panel
    dashboardFilterHeader = "စိစစ်မှုများ";
    dashboardFilterDisasterTypeInutLabel = "သဘာဝဘေးအမျိုးအစား";
    dashboardFilterLocationInputGroupLabel = "တည်နေရာ";
    dashboardFilterRegionInputLabel = "ဒေသ";
    dashboardFilterDistrictInputLabel = "နယ်";
    dashboardFilterTownshipInputLabel = "မြို့နယ်";
    dashboardFilterDateRangeInputGroupLabel = "ရက်စွဲများ";
    dashboardFilterStartDateInputLabel = "ရက်စွဲကိုစတင်ခြင်း";
    dashboardFilterEndDateInputLabel = "ရက်စွဲကိုအဆုံးသတ်ခြင်း";
    dashboarFilterApplyButton = "ရေစစ်";
    // file import
    dashboardFileImportHeader = "ဆိုင်းအောက်";
    dashboardFileImportNoFileSelectedError = "ဆိုင်းအောက်";
    dashboardFileImportSuccessMessage = "ဆိုင်းအောက်";
    dashboardFileImportFailureMessage = "ဆိုင်းအောက်";
    dashboardFileImportSelectFileLabel = "ဆိုင်းအောက်";
    dashboardFileImportAcceptedFileTypesHelpText = "ဆိုင်းအောက်";
    dashboardFileImportErrorBehaviorHelpText = "ဆိုင်းအောက်";
    dashboardFileImportSubmitButton = "ဆိုင်းအောက်";
    // people
    dashboardPeopleMetrics = {
        numberAffected: "ဆိုင်းအောက်",
        numberBeforeDisaster: "ဆိုင်းအောက်",
        numberDisplaced: "ဆိုင်းအောက်",
        numberLeftArea: "ဆိုင်းအောက်",
        numberNotDisplaced: "ဆိုင်းအောက်",
        numberOfCasualties: "ဆိုင်းအောက်",
        numberReturned: "ဆိုင်းအောက်",
        numberStayedInArea: "ဆိုင်းအောက်"
    };
    // rankings    
    dashboardRankingResponseModalitiesTitle = "ဆိုင်းအောက်";
    dashboardRankingPrioritySectorsTitle = "ဆိုင်းအောက်";
    dashboardRankingVulnerableGroupsTitle = "ဆိုင်းအောက်";
    dashboardRankingAffectedGroupsTitle = "ဆိုင်းအောက်";
    // sectors    
    dashboardSectorHeatMapHeader = "ဆိုင်းအောက်";
    dashboardSectorHeatmapSeverityHeader = "ဆိုင်းအောက်";
    dashboardSectorHeatmapFactorsHeader = "ဆိုင်းအောက်";
    dashboardSectorHeatmapBasicNeedsHeader = "ဆိုင်းအောက်";
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