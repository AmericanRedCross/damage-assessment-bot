import { Prompts, ListStyle } from "botbuilder";
import rcdaChatDialog from "@/chat/utils/rcdaChatDialog";
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
            Prompts.choice(session, localizer.mm.askDisasterType, localizer.mm.disasterTypes, { listStyle: ListStyle.button });
        },
        ({ session, localizer, result: { response } }) => {
            session.conversationData.mm.disasterTypeId = response.entity;
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
            RcdaPrompts.adaptiveCard(session, createAdaptiveCardforRegions(localizer));
        },
        ({ session, localizer, result}) => {
            RcdaPrompts.adaptiveCard(session, createAdaptiveCardForDistricts(localizer, result.response.regionCode));
        },
        ({ session, localizer, result}) => {
            RcdaPrompts.adaptiveCard(session, createAdaptiveCardForTownships(localizer, result.response.districtCode));
        },
        ({ session, result }) => {
            session.userData.lastUsedTownship = result.response.townshipCode;
            session.endDialog();
        }
    ]
);


function createAdaptiveCardforRegions(localizer: RcdaChatLocalizer) {
    return {
        body: [
            {
                "type": "TextBlock",
                "size": "medium",
                "weight": "default",
                "text": localizer.mm.askAdminStackRegionName,
                "horizontalAlignment": "left"
            }, {
                "type": "Input.ChoiceSet",
                "style": "compact",
                "id": "regionCode",
                "choices": getKeys(myanmarRegions).map(myanmarRegionCode => ({
                    title: localizer.mm.regions[myanmarRegionCode],
                    value: myanmarRegionCode
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

function createAdaptiveCardForDistricts(localizer: RcdaChatLocalizer, regionCode: string) {
    return {
        body: [
            {
                "type": "TextBlock",
                "size": "medium",
                "weight": "default",
                "text": localizer.mm.askAdminStackDistrictName,
                "horizontalAlignment": "left"
            }, {
                "type": "Input.ChoiceSet",
                "style": "compact",
                "id": "districtCode",
                "choices": getKeys(myanmarRegions[regionCode]).map(myanmarDistrictCode => ({
                    title: localizer.mm.districts[myanmarDistrictCode],
                    value: myanmarDistrictCode
                }))
            }
        ],
        actions: [
            {
                "type": "Action.Submit",
                "title": localizer.mm.submitCard
            }
        ]
    };
}

function createAdaptiveCardForTownships(localizer: RcdaChatLocalizer, districtCode: string) {
    return {
        body: [
            {
                "type": "TextBlock",
                "size": "medium",
                "weight": "default",
                "text": localizer.mm.askAdminStackTownshipName,
                "horizontalAlignment": "left"
            }, {
                "type": "Input.ChoiceSet",
                "style": "compact",
                "id": "townshipCode",
                "choices": getKeys(myanmarDistricts[districtCode]).map(myanmarTownshipCode => ({
                    title: localizer.mm.townships[myanmarTownshipCode],
                    value: myanmarTownshipCode
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