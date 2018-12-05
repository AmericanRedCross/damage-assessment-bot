import { Prompts, ListStyle } from "botbuilder";
import rcdaChatDialog from "@/chat/utils/rcdaChatDialog";
import { MyanmarGeographicalSettings } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarGeographicalSettings";
import RcdaPrompts from "@/chat/prompts/RcdaPrompts";
import { myanmarTownships } from "@common/system/countries/myanmar/MyanmarTownship"
import RcdaChatLocalizer from "@/chat/localization/RcdaChatLocalizer";
import { getKeys, getValues } from "@common/utils/objectHelpers";

export const askUserInfoDialog = rcdaChatDialog(
    "/askUserInfo",
    null,
    [
        ({ session, localizer }) => {
            Prompts.text(session, localizer.mm.askTownshipName);
        },
        ({ session, localizer, result: { response } }) => {
            // TODO validate against list of myanmar townships in /common/src/system/countries/myanmar/MyanmarTownships
            session.conversationData.mm.townshipId = response;

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
    ]);

export const confirmUserAdminStack = rcdaChatDialog(
    "/confirmUserAdminStack",
    null,
    [
        ({ session, localizer, next }) => {
            const currentAdminStack: string = session.userData.adminStack;
            if (currentAdminStack) {
                Prompts.choice(
                    session,
                    localizer.mm.tellCurrentAdminStack(currentAdminStack),
                    [localizer.common.yes,localizer.common.no]);
            } else {
                next();
            }
        },
        ({ session, result, localizer }) => {
            if (result.response === localizer.common.yes && !session.userData.adminStack) {
                session.beginDialog(askUserAdminStack.id);
            }
            session.send(localizer.mm.reportCurrentAdminStack(session.userData.adminStack));
            session.endDialog();
        }
    ]
);

export const askUserAdminStack = rcdaChatDialog(
    "/askUserAdminStack",
    null,
    [
        ({ session, localizer }) => {
            RcdaPrompts.adaptiveCard(session,createAdaptiveCardforRegions(localizer));
        },
        ({ session, localizer, result}) => {
            const selectedRegion: string = result.region;
            RcdaPrompts.adaptiveCard(session,createAdaptiveCardForDistricts(localizer,selectedRegion));
        },
        ({ session, localizer, result}) => {
            const selectedDistrict: string = result.district;
            RcdaPrompts.adaptiveCard(session,createAdaptiveCardForTownships(localizer,selectedDistrict));
        },
        ({ session, result }) => {
            session.userData.adminStack = result.township;
            session.endDialog();
        }
    ]
);


function createAdaptiveCardforRegions(localizer: RcdaChatLocalizer) {
    const adaptiveCardBody:Array<object> = [
        {
            "type": "TextBlock",
            "size": "medium",
            "weight": "default",
            "text": localizer.mm.askAdminStackRegionName,
            "horizontalAlignment": "left"
        }
    ];

    const myanmarRegionSet:Set<string> = new Set();
    myanmarTownships.forEach(myanmarTownship => {
        myanmarRegionSet.add(myanmarTownship.regionName);
    });

    const myanmarRegionArray = Array.from(myanmarRegionSet).sort();

    const myanmarRegionChoices: object[] = [];
    myanmarRegionArray.forEach(myanmarRegion => {
        myanmarRegionChoices.push({
            title: myanmarRegion,
            value: myanmarRegion
        });
    });

    adaptiveCardBody.push({
        "type": "Input.ChoiceSet",
        "style": "compact",
        "id": "region",
        "choices": [...myanmarRegionChoices]
    });

    return {
        body: [...adaptiveCardBody],
            actions: [
                {
                    "type": "Action.Submit",
                    "title": localizer.mm.submitCard,
                }
            ]
    };
}

function createAdaptiveCardForDistricts(localizer: RcdaChatLocalizer, region: string) {
    const adaptiveCardBody: object[] = [
        {
            "type": "TextBlock",
            "size": "medium",
            "weight": "default",
            "text": localizer.mm.askAdminStackDistrictName,
            "horizontalAlignment": "left"
        }
    ];

    const myanmarDistrictSet: Set<string> = new Set();
    
    myanmarTownships.forEach(myanmarTownship => {
        if (myanmarTownship.regionName === region) {
            myanmarDistrictSet.add(myanmarTownship.districtName);
        }
    });

    const myanmarDistrictArray = Array.from(myanmarDistrictSet).sort();

    const myanmarDistrictChoices: object[] = [];
    myanmarDistrictArray.forEach(myanmarDistrict => {
        myanmarDistrictChoices.push({
            title: myanmarDistrict,
            value: myanmarDistrict
        });
    });

    adaptiveCardBody.push({
        "type": "Input.ChoiceSet",
        "style": "compact",
        "id": "district",
        "choices": [...myanmarDistrictChoices]
    });

    return {
        body: [...adaptiveCardBody],
        actions: [
            {
                "type": "Action.Submit",
                "title": localizer.mm.submitCard
            }
        ]
    };
}

function createAdaptiveCardForTownships(localizer: RcdaChatLocalizer, district: string) {
    const adaptiveCardBody:object[] = [
        {
            "type": "TextBlock",
            "size": "medium",
            "weight": "default",
            "text": localizer.mm.askAdminStackTownshipName,
            "horizontalAlignment": "left"
        }
    ];

    const myanmarTownshipSet:Set<string> = new Set();
    
    myanmarTownships.forEach(myanmarTownship => {
        if (myanmarTownship.districtName === district) {
            myanmarTownshipSet.add(myanmarTownship.townshipName);
        }
    });

    const myanmarTownshipArray = Array.from(myanmarTownshipSet).sort();

    const myanmarTownshipChoices:object[] = [];
    myanmarTownshipArray.forEach(myanmarTownship => {
        myanmarTownshipChoices.push({
            title: myanmarTownship,
            value: myanmarTownship
        });
    });

    adaptiveCardBody.push({
        "type": "Input.ChoiceSet",
        "style": "compact",
        "id": "township",
        "choices": [...myanmarTownshipChoices]
    });

    return {
        body: [...adaptiveCardBody],
        actions: [
            {
                "type": "Action.Submit",
                "title": localizer.mm.submitCard,
            }
        ]
    };
}
