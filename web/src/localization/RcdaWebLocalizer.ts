import { RcdaCommonTextEnglish, RcdaMyanmarTextEnglish } from "@/localization/RcdaTextEnglish";
import { RcdaCommonTextBurmese, RcdaMyanmarTextBurmese } from "@/localization/RcdaTextBurmese";
import { RcdaCommonTextBurmeseZawgyiEncoding, RcdaMyanmarTextBurmeseZawgyiEncoding } from "@/localization/RcdaTextBurmeseZawgyiEncoding";
import { RcdaLanguages } from "@common/system/RcdaLanguages"

type RcdaCommonText = RcdaCommonTextEnglish;
type RcdaMyanmarText = RcdaMyanmarTextEnglish;

export default class RcdaChatLocalizer {

    constructor(public language: RcdaLanguages) {}
    
    static readonly CommonTextLocaleMap: {[key in RcdaLanguages]: new() => RcdaCommonText} = {
        [RcdaLanguages.English]: RcdaCommonTextEnglish,
        [RcdaLanguages.Burmese]: RcdaCommonTextBurmese,
        [RcdaLanguages.BurmeseZawgyi]: RcdaCommonTextBurmeseZawgyiEncoding
    };
    get common(): RcdaCommonText {
        return new RcdaChatLocalizer.CommonTextLocaleMap[this.language]();
    }
    
    static readonly MyanmarTextLocaleMap: {[key in RcdaLanguages]: new() => RcdaMyanmarText} = {
        [RcdaLanguages.English]: RcdaMyanmarTextEnglish,
        [RcdaLanguages.Burmese]: RcdaMyanmarTextBurmese,
        [RcdaLanguages.BurmeseZawgyi]: RcdaMyanmarTextBurmeseZawgyiEncoding
    };
    get mm(): RcdaMyanmarText {
        return new RcdaChatLocalizer.MyanmarTextLocaleMap[this.language]();
    }
}