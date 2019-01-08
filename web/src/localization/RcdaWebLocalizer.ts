import { RcdaCommonTextEnglish, RcdaMyanmarTextEnglish } from "@/localization/RcdaTextEnglish";
import { RcdaCommonTextBurmese, RcdaMyanmarTextBurmese } from "@/localization/RcdaTextBurmese";
import { RcdaLanguages } from "@common/system/RcdaLanguages"
import Vue from "vue";

type RcdaCommonText = RcdaCommonTextEnglish;
type RcdaMyanmarText = RcdaMyanmarTextEnglish;

export default class RcdaChatLocalizer {

    constructor(public language: RcdaLanguages) {}
    
    static readonly CommonTextLocaleMap: {[key in RcdaLanguages]: new() => RcdaCommonText} = {
        [RcdaLanguages.English]: RcdaCommonTextEnglish,
        [RcdaLanguages.Burmese]: RcdaCommonTextBurmese
    };
    get common(): RcdaCommonText {
        return new RcdaChatLocalizer.CommonTextLocaleMap[this.language]();
    }
    
    static readonly MyanmarTextLocaleMap: {[key in RcdaLanguages]: new() => RcdaMyanmarText} = {
        [RcdaLanguages.English]: RcdaMyanmarTextEnglish,
        [RcdaLanguages.Burmese]: RcdaMyanmarTextBurmese
    };
    get mm(): RcdaMyanmarText {
        return new RcdaChatLocalizer.MyanmarTextLocaleMap[this.language]();
    }
}