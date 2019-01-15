import { RcdaCommonTextEnglish, RcdaMyanmarTextEnglish } from "@/chat/localization/RcdaTextEnglish";
import { RcdaCommonTextBurmese, RcdaMyanmarTextBurmese } from "@/chat/localization/RcdaTextBurmese";
import { RcdaTypedSession } from "@/chat/utils/rcda-chat-types";
import { RcdaLanguages } from "@common/system/RcdaLanguages"

export type RcdaCommonText = RcdaCommonTextEnglish;
export type RcdaMyanmarText = RcdaMyanmarTextEnglish;

export default class RcdaChatLocalizer {

    constructor(language: RcdaLanguages)
    constructor(session: RcdaTypedSession)
    constructor(config: RcdaLanguages|RcdaTypedSession) {
        let language = typeof config === "string" ? config : config.userData.language;
        this.common = getLocalizedText(CommonTextLocaleMap, language);
        this.mm = getLocalizedText(MyanmarTextLocaleMap, language);
    }

    common: RcdaCommonText;
    mm: RcdaMyanmarText;
}

const CommonTextLocaleMap: {[key in RcdaLanguages]: new() => RcdaCommonText} = {
    [RcdaLanguages.English]: RcdaCommonTextEnglish,
    [RcdaLanguages.Burmese]: RcdaCommonTextBurmese
};
const MyanmarTextLocaleMap: {[key in RcdaLanguages]: new() => RcdaMyanmarText} = {
    [RcdaLanguages.English]: RcdaMyanmarTextEnglish,
    [RcdaLanguages.Burmese]: RcdaMyanmarTextBurmese
};

function getLocalizedText<TResult>(
    textLocaleMap: {[key in RcdaLanguages]: new() => TResult},
    language: RcdaLanguages): TResult {

    let localizedTextType = textLocaleMap[language] || textLocaleMap[RcdaLanguages.English];
    let localizedText = new localizedTextType();
    
    return localizedText;
}