import rcdaChatDialog from "@/chat/utils/rcdaChatDialog";
import { Prompts, ListStyle } from "botbuilder";
import { RcdaLanguageNames, RcdaLanguages } from "@common/system/RcdaLanguages";
import { getKeys, getValues } from "@common/utils/objectHelpers";

export const selectLanguageDialog = rcdaChatDialog(
    "/selectLanguage",
    null,
    [
        ({ session, localizer }) => {
            let languageNames = getValues(RcdaLanguageNames);
            Prompts.choice(session, localizer.common.askPreferredLanguage, languageNames, { listStyle: ListStyle.button });
        },
        ({ session, result: { response } }) => {
            session.conversationData.language = getKeys(RcdaLanguageNames)[response.index] as RcdaLanguages;
            session.preferredLocale(session.conversationData.language);
            session.endDialog();
        }
    ],
    {
        references: []
    });
