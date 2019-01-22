import { Prompts, ListStyle, ResumeReason } from "botbuilder";
import rcdaChatDialog, { rcdaChatDialogStateful } from "@/chat/utils/rcdaChatDialog";
import { MyanmarGeographicalSettings } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarGeographicalSettings";
import RcdaPrompts from "@/chat/prompts/RcdaPrompts";
import { myanmarRegions, myanmarDistricts } from "@common/system/countries/myanmar/MyanmarAdminStack";
import RcdaChatLocalizer from "@/chat/localization/RcdaChatLocalizer";
import { getKeys, getValues } from "@common/utils/objectHelpers";

export const askUserInfoDialog = rcdaChatDialog(
    "/askUserInfo",
    null,
    [
        ({ session }) => {
            session.beginDialog(confirmUserAdminStack.id);
        },
        ({ session, localizer }) => {
            
            RcdaPrompts.adaptiveCard(session, createAdaptiveCardForDisasterTypes(localizer));
        },
        ({ session, localizer, result: { response } }) => {
            session.conversationData.mm.disasterTypeId = response.disasterType;
            Prompts.choice(session, localizer.mm.askGeographicalSettingType, getValues(localizer.mm.geographicalSettings), { listStyle: ListStyle.button });
        },
        ({ session, localizer, result: { response } }) => {
            session.conversationData.mm.geographicalSettingId = getKeys(localizer.mm.geographicalSettings)[response.index] as MyanmarGeographicalSettings;
            session.endDialog();
        }
    ],
    {
        references: () => [
            confirmUserAdminStack
        ]
    });

export const confirmUserAdminStack = rcdaChatDialog(
    "/confirmUserAdminStack",
    null,
    [
        ({ session, localizer, next }) => {
            const lastUsedTownship: string = session.userData.lastUsedTownship;
            if (lastUsedTownship) {
                Prompts.choice(
                    session,
                    localizer.mm.askToChangeSelectedAdminStack(localizer.mm.townships[lastUsedTownship]),
                    [
                        localizer.common.yes, 
                        localizer.common.no
                    ],
                    {listStyle:ListStyle.button});
            } else {
                next();
            }
        },
        ({ session, result, localizer, next }) => {
            if (!session.userData.lastUsedTownship || result.response.entity === localizer.common.yes) {
                session.beginDialog(askUserAdminStack.id);
            } else {
                next();
            }
        },
        ({ session, localizer }) => {
            session.send(localizer.mm.reportCurrentAdminStack(localizer.mm.townships[session.userData.lastUsedTownship]));
            session.conversationData.mm.townshipId = session.userData.lastUsedTownship;
            session.endDialog();
        }
    ],
    {
        references: () => [
            askUserAdminStack
        ]
    }
);

export const askUserAdminStack = rcdaChatDialog(
    "/askUserAdminStack",
    null,
    [
        ({ session, localizer }) => {
            let choices = getKeys(myanmarRegions).map(myanmarRegionCode => ({
                title: localizer.mm.regions[myanmarRegionCode],
                value: myanmarRegionCode
            }));
            session.beginDialog(getUserAdminStackLevelDialog.id, { 
                label: localizer.mm.askAdminStackRegionName, 
                choices
            });
        },
        ({ session, localizer, result: { response: regionCode } }) => {
            session.beginDialog(getUserAdminStackLevelDialog.id, { 
                label: localizer.mm.askAdminStackDistrictName, 
                choices: getKeys(myanmarRegions[regionCode].districts).map(myanmarDistrictCode => ({
                    title: localizer.mm.districts[myanmarDistrictCode],
                    value: myanmarDistrictCode
                }))
            })
        },
        ({ session, localizer, result: { response: districtCode } }) => {
            session.beginDialog(getUserAdminStackLevelDialog.id, { 
                label: localizer.mm.askAdminStackTownshipName, 
                choices: getKeys(myanmarDistricts[districtCode].townships).map(myanmarTownshipCode => ({
                    title: localizer.mm.townships[myanmarTownshipCode],
                    value: myanmarTownshipCode
                }))
            })
        },
        ({ session, result }) => {
            session.userData.lastUsedTownship = result.response;
            session.endDialog();
        }
    ], {
        references: () => [ getUserAdminStackLevelDialog ]
    });

export const getUserAdminStackLevelDialog = rcdaChatDialogStateful(
    "/getUserAdminStackLevel",
    null,
    ({ result: { label, choices } }) => ({
        label, 
        choices 
    }),
    [
        ({ session, localizer }) => {
            let { label, choices } = session.dialogData;
            RcdaPrompts.adaptiveCard(session, createAdaptiveCardForAdminStackLevelSelector(localizer, label, choices));
        },
        ({ session, result, localizer }) => {
            if (result.response.value === localizer.common.selectDropdownPlaceholder) {
                session.send("This value is required. Please try again.");
                session.replaceDialog(getUserAdminStackLevelDialog.id, session.dialogData);
                return;
            }
            session.endDialogWithResult({
                response: result.response.value
            });
        }
    ]);

    
function createAdaptiveCardForAdminStackLevelSelector(
    localizer: RcdaChatLocalizer, 
    label: string, 
    choices: { title: string, value: string}[]) 
{
    return {
        body: [
            {
                "type": "TextBlock",
                "size": "medium",
                "weight": "default",
                "text": label,
                "horizontalAlignment": "left"
            }, {
                "type": "Input.ChoiceSet",
                "style": "compact",
                "id": "value",
                "placeholder": localizer.common.selectDropdownPlaceholder,
                "choices": choices
            }
        ],
            actions: [
                {
                    "type": "Action.Submit",
                    "title": localizer.mm.submitCard,
                }
            ]
    };
}

function createAdaptiveCardForDisasterTypes(localizer: RcdaChatLocalizer) {
    return {
        body: [
            {
                "type": "TextBlock",
                "size": "medium",
                "weight": "default",
                "text": localizer.mm.askDisasterType,
                "horizontalAlignment": "left"
            }, {
                "type": "Input.ChoiceSet",
                "style": "compact",
                "id": "disasterType",
                "placeholder": localizer.common.selectDropdownPlaceholder,
                "choices": getKeys(localizer.mm.disasterTypes).map(disasterType => ({
                    title: localizer.mm.disasterTypes[disasterType],
                    value: disasterType
                }))
            }
        ],
        actions: [
            {
                "type": "Action.Submit",
                "title": localizer.mm.submitCard,
            }
        ]
    };
}