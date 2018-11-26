import rcdaChatDialog from "@/chat/utils/rcdaChatDialog";
import { Prompts, ListStyle } from "botbuilder";
import { RcdaLanguageNames, RcdaLanguages } from "@common/system/RcdaLanguages";

export const selectLanguageDialog = rcdaChatDialog(
    "/selectLanguage",
    null,
    [
        ({ session, localizer }) => {
            let languageNames = Object.values(RcdaLanguageNames);
            Prompts.choice(session, localizer.common.askPreferredLanguage, languageNames, { listStyle: ListStyle.button });
        },
        ({ session, result: { response } }) => {
            session.conversationData.language = Object.keys(RcdaLanguageNames)[response.index] as RcdaLanguages;
            session.preferredLocale(session.conversationData.language);
            session.endDialog();
        }
    ],
    {
        references: []
    });
