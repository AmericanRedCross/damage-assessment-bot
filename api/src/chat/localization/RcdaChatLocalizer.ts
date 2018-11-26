import { RcdaCommonTextEnglish, RcdaMyanmarTextEnglish } from "@/chat/localization/RcdaTextEnglish";
import { RcdaCommonTextBurmese, RcdaMyanmarTextBurmese } from "@/chat/localization/RcdaTextBurmese";
import { RcdaTypedSession } from "@/chat/utils/rcda-chat-types";

export type RcdaCommonText = RcdaCommonTextEnglish;
export type RcdaMyanmarText = RcdaMyanmarTextEnglish;

export default class RcdaChatLocalizer {

    constructor(session: RcdaTypedSession) {
        this.common = getLocalizedText(CommonTextLocaleMap, "RcdaCommonText", session);
        this.mm = getLocalizedText(MyanmarTextLocaleMap, "RcdaMyanmarText", session);
    }

    common: RcdaCommonText;
    mm: RcdaMyanmarText;
}

const CommonTextLocaleMap: {[key:string]: new() => RcdaCommonText} = {
    "en": RcdaCommonTextEnglish,
    "my": RcdaCommonTextBurmese
};
const MyanmarTextLocaleMap: {[key:string]: new() => RcdaMyanmarText} = {
    "en": RcdaMyanmarTextEnglish,
    "my": RcdaMyanmarTextBurmese
};

function getLocalizedText<TResult>(
    textLocaleMap: {[key:string]: new() => TResult}, 
    name: string,
    session: RcdaTypedSession): TResult {

    let locale = session.preferredLocale().split("-")[0].toLowerCase();
    let localizedTextType = textLocaleMap[locale];
    if (!localizedTextType) {
        throw new Error(`Locale '${locale}' is not supported for ${name}`);
    }
    let localizedText = new localizedTextType();
    
    return localizedText;
}