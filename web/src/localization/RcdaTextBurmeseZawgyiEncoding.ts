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
export class RcdaCommonTextBurmeseZawgyiEncoding implements RcdaCommonTextEnglish {
    siteTitle = "ထိခိုက္မႈဆန္းစစ္အကဲျဖတ္ခ်က္ဆိုင္ရာ သိမွတ္စရာ အေၾကာင္းအရာမ်ား";
    signOutButton = "အေကာင့္မွထြက္ခြာမည္";
    confirmSignOut = "အေကာင့္မွ ထြက္ခြာမည္ဆိုတာ ေသခ်ာပါသလား။ မျပီးဆံုးေသးေသာ အခ်က္အလက္ အစီအရင္ခံစာ မွန္သမွ် သိမ္းဆည္းထားမည္မဟုတ္ပါ။";
    sessionTimeoutMessage = "Your session has expired. Any unfinished chat reports were not saved.";
    // inputs
    languageSelectorLabel = "ဘာသာစကား ေရြးပါ။";
    fileSelectorLabel = "၀က္(ဘ္)ဆိုက္ စာမ်က္နွာမ်ားကိုဖတ္မည္။";
    dropdownInputSelectAllOption = "အားလံုး";
    // login
    loginHeader = "အေကာင့္ ၀င္ေရာက္မည္။";
    loginFieldsMissingError = "အေကာင့္နာမည္နွင့္ စကား၀ွက္ျဖည့္သြင္းေပးပါ။";
    loginCredentialsInvalidError = "အေကာင့္နာမည္ႏွင့္ စကား၀ွက္ မမွန္ကန္ပါ။";
    loginUnknownError = "မေမွ်ာ္လင့္ပဲ အေကာင့္ ၀င္ေရာက္၍ မရပါ။ ေက်းဇူးျပဳျပီး ေနာက္တစ္ခါ ျပန္လည္ ၾကိဳးစားပါ။";
    loginUsernameLabel = "အေကာင့္နာမည္";
    loginPasswordLabel = "စကား၀ွက္";
    loginPasswordRecoveryLink = "စကား၀ွက္ ေမ့ေနပါသလား။";
    loginSubmitButton = "အေကာင့္ ၀င္ေရာက္မည္။";
    loginProviderDescription = "သင္၏ IFRC GO အရည္အခ်င္းအေထာက္အထားမ်ား အသံုးျပဳရန္";
    loginRegistrationLink = "အေကာင့္ စာရင္းသြင္းရန္။";
}

export class RcdaMyanmarTextBurmeseZawgyiEncoding implements RcdaMyanmarTextEnglish {
    // dashboard
    dashboardCloseFilterPanelButton = "စီစစ္ခ်က္မ်ား ပိတ္ရန္";
    dashboardOpenFilterPanelButton = "စီစစ္ခ်က္မ်ား ဖြင့္ရန္";
    dashboardFileImportButton = "ဖိုင္လ္မ်ား တင္ရန္";
    dashboardDownloadCsvTemplateButton = "CSV ပံုစံ";
    dashboardChatbotLink = "chatbot သို႕သြားရန္";
    dashboardRankingSeeAllButton = "အစီရင္ခံထားသည္မ်ား အားလံုးကိုၾကည့္ရန္။";
    dashboardSummaryHeadersAllDisasterTypes = "ေဘးအႏၲရာယ္ျဖစ္စဥ္အမ်ိဳးအစားအားလံုး";
    dashboardSummaryHeadersAllRegions = "ျပည္နယ္အားလံုး";
    dashboardSectorHeatmapHeader = "အက်ဥ္းခ်ဳပ္";
    // filter panel
    dashboardFilterHeader = "စီစစ္ခ်က္မ်ား";
    dashboardFilterDisasterTypeInutLabel = "ေဘးအႏၲရာယ္ျဖစ္စဥ္အမ်ိဳးအစား";
    dashboardFilterLocationInputGroupLabel = "တည္ေနရာ";
    dashboardFilterRegionInputLabel = "ျပည္နယ္";
    dashboardFilterDistrictInputLabel = "ခရိုင္";
    dashboardFilterTownshipInputLabel = "ျမိဳ႕နယ္";
    dashboardFilterDateRangeInputGroupLabel = "ရက္စြဲ အပိုင္းအျခား";
    dashboardFilterStartDateInputLabel = "စတင္သည့္ ရက္စြဲ";
    dashboardFilterEndDateInputLabel = "ျပီးဆံုးသည့္ ရက္စြဲ";
    dashboarFilterApplyButton = "စီစစ္ခ်က္မ်ားအသံုးျပဳရန္";
    // file import
    dashboardFileImportHeader = "CSV ဖိုင္လ္တင္ရန္";
    dashboardFileImportNoFileSelectedError = "မည္သည့္ ဖိုင္လ္မွ ေရြးခ်ယ္ထားျခင္းမရွိေသးပါ။ ေက်းဇူးျပဳျပီး တင္ပို႕ရန္ ဖိုင္လ္တစ္ခု ေရြးခ်ယ္ပါ။";
    dashboardFileImportSuccessMessage = "ဖိုင္လ္တင္ပို႕ျခင္း ေအာင္ျမင္စြာ ျပီးဆံုးပါျပီ။";
    dashboardFileImportFailedUnexpectedly = "File import failed unexpectedly. Please try again later.";
    dashboardFileImportFailedValidation = "File import failed because one or more issues were found. Please fix these issues and try again.";
    dashboardFileImportSelectFileLabel = "ဖိုင္လ္ေရြးခ်ယ္ပါ။";
    dashboardFileImportAcceptedFileTypesHelpText = "မွန္ကန္သည့္ ကိန္းဂဏန္းမ်ားပါ၀င္ေသာ .csv နွင့္ .json ဖိုင္လ္မ်ားသာ လက္ခံပါမည္။ Excel (.xlsx) ဖိုင္လ္မ်ား လက္မခံပါ။";
    dashboardFileImportErrorBehaviorHelpText = "အေထာက္အထားျပဳျခင္းဆုိင္ရာ အခက္အခဲမ်ား ေတြ႕ရွိခဲ့ပါက မည္သည့္အစီအရင္ခံစာမ်ားကိုမွ လုပ္ေဆာင္မည္မဟုတ္ပါ။ မွားယြင္းခ်က္ အေသးစိတ္ကို ေအာက္တြင္ေဖာ္ျပပါမည္။";
    dashboardFileImportSubmitButton = "တင္ျပမည္။";
    dashboardFileImportFormatHelpTextPart1OutsideLink = "ပံုစံအခ်ိဳးအစား(format) မွန္ကန္ရန္";
    dashboardFileImportFormatHelpTextPart2InsideLink = "ပံုစံ(template)ကို ဒီမွာ ေဒါင္းလုပ္ဆြဲပါ။";
    // people
    dashboardPeopleMetrics = {        
        numberBeforeDisaster: "ေဘးအႏၲရာယ္မတိုင္မီ လူဦးေရ",
        numberLeftArea: "ေဒသကိုစြန္႔ခြာသြားသည့္ လူဦးေရ",
        numberReturned: "ျပန္လည္ေရာက္ရွိလာသည့္ လူဦးေရ",
        numberStayedInArea: "ေဒသတြင္လက္ရွိေနထိုင္သည့္ လူဦးေရ",
        numberAffected: "ထိခိုက္ခံရသည့္ လူဦးေရ (စုစုေပါင္း)",
        numberDisplaced: "ေနရပ္စြန္႕ခြာသည့္ လူဦးေရ",
        numberNotDisplaced: "ေနရပ္မစြန္႕ခြာ ပဲ ထိခိုက္ခံရသည့္ လူဦးေရ",
        numberOfCasualties: "ဒဏ္ရာရသည့္ လူဦးေရ"
    };
    // rankings    
    dashboardRankingResponseModalitiesTitle = "တံု႕ျပန္မႈဆိုင္ရာ နည္းလမ္းမ်ား";
    dashboardRankingPrioritySectorsTitle = "ဦးစားေပး အခန္းကဏၰမ်ား";
    dashboardRankingVulnerableGroupsTitle = "ထိခိုက္ခံရလြယ္ေသာ အုပ္စုမ်ား";
    dashboardRankingAffectedGroupsTitle = "အက်ိဳးသက္ေရာက္ခံ အုပ္စုမ်ား";
    // sectors    
    dashboardSectorHeatMapHeader = "အခန္းကဏၰမ်ား";
    dashboardSectorHeatmapSeverityHeader = "ျပင္းထန္မႈ";
    dashboardSectorHeatmapFactorsHeader = "အေၾကာင္းအရင္းမ်ား";
    dashboardSectorHeatmapBasicNeedsHeader = "အေျခခံ လိုအပ္ခ်က္မ်ား";
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