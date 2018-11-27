import { RcdaCommonTextEnglish, RcdaMyanmarTextEnglish } from "@/chat/localization/RcdaTextEnglish";
import { RcdaCommonTextBurmese, RcdaMyanmarTextBurmese } from "@/chat/localization/RcdaTextBurmese";
import { RcdaTypedSession } from "@/chat/utils/rcda-chat-types";
import { RcdaLanguages } from "@common/system/RcdaLanguages"

export type RcdaCommonText = RcdaCommonTextEnglish;
export type RcdaMyanmarText = RcdaMyanmarTextEnglish;

export default class RcdaChatLocalizer {

    constructor(session: RcdaTypedSession) {
        this.common = getLocalizedText(CommonTextLocaleMap, session);
        this.mm = getLocalizedText(MyanmarTextLocaleMap, session);
    }

    common: RcdaCommonText;
    mm: RcdaMyanmarText;
}

const CommonTextLocaleMap: {[key:string]: new() => RcdaCommonText} = {
    [RcdaLanguages.English]: RcdaCommonTextEnglish,
    [RcdaLanguages.Burmese]: RcdaCommonTextBurmese
};
const MyanmarTextLocaleMap: {[key:string]: new() => RcdaMyanmarText} = {
    [RcdaLanguages.English]: RcdaMyanmarTextEnglish,
    [RcdaLanguages.Burmese]: RcdaMyanmarTextBurmese
};

function getLocalizedText<TResult>(
    textLocaleMap: {[key:string]: new() => TResult},
    session: RcdaTypedSession): TResult {

    let language = session.conversationData.language;
    let localizedTextType = textLocaleMap[language] || textLocaleMap[RcdaLanguages.English];
    let localizedText = new localizedTextType();
    
    return localizedText;
}