import rcdaChatEvent from "@/chat/utils/rcdaChatEvent";
import { RcdaLanguages } from "@common/system/RcdaLanguages";
import rcdaChatDialog, { rcdaChatDialogStateful } from "@/chat/utils/rcdaChatDialog";
import { rootDialog } from "@/chat/dialogs/rootDialog";
import { Prompts, ListStyle } from "botbuilder";
import RcdaChatLocalizer from "../localization/RcdaChatLocalizer";

export default rcdaChatEvent(
    "setLanguage",
    null,
    ({ value, session }) => {
        let newLanguage = <RcdaLanguages>value;
        let languageChanged = session.userData.language !== newLanguage;
        let dialogStack = session.dialogStack();

        if (dialogStack.length === 0) {
            session.userData.language = newLanguage;
            session.beginDialog(rootDialog.id);
            return;
        }

        let isInApproveLanguageChangeDialogAlready = dialogStack.slice(-2)[0].id === approveLanguageChangeDialog.id;
        if (languageChanged && !isInApproveLanguageChangeDialogAlready) {    
            session.beginDialog(approveLanguageChangeDialog.id, value);
        }
    },
    {
        references: () => [ approveLanguageChangeDialog ]
    });

export const approveLanguageChangeDialog = rcdaChatDialogStateful(
    "approveLanguageChange",
    null,
    ({ result }) => ({
        newLanguage: <RcdaLanguages>result
    }),
    [
        ({ session, localizer }) => {
            let newLangLocalizer = new RcdaChatLocalizer(session.dialogData.newLanguage);
            Prompts.choice(
                session,
                `${newLangLocalizer.common.askToChangeSelectedLanguage}\n\n${localizer.common.askToChangeSelectedLanguage}`,
                [
                    getYesText(localizer, newLangLocalizer), 
                    getNoText(localizer, newLangLocalizer)
                ],
                {listStyle:ListStyle.button});
        },
        ({ result, session, localizer }) => {
            let newLangLocalizer = new RcdaChatLocalizer(session.dialogData.newLanguage);
            let choice: string = result.response.entity;
            let yesText = getYesText(localizer, newLangLocalizer);
            
            if (choice === yesText) {
                session.userData.language = session.dialogData.newLanguage;
                session.replaceDialog(rootDialog.id);
            }
            else {
                session.endDialog();
            }
        }
    ])

function getYesText(oldLangLocalizer: RcdaChatLocalizer, newLangLocalizer: RcdaChatLocalizer) {
    return `${newLangLocalizer.common.yes} (${oldLangLocalizer.common.yes})`; 
}

function getNoText(oldLangLocalizer: RcdaChatLocalizer, newLangLocalizer: RcdaChatLocalizer) {
    return `${newLangLocalizer.common.no} (${oldLangLocalizer.common.no})`; 
}