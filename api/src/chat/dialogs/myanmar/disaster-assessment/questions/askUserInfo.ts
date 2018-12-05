import { Prompts,ListStyle,TextFormat, Session, Message } from "botbuilder";
import rcdaChatDialog from "@/chat/utils/rcdaChatDialog";
import { MyanmarGeographicalSettings } from "@common/models/resources/disaster-assessment/enums/MyanmarGeographicalSettings"
import RcdaPrompts from "@/chat/prompts/RcdaPrompts";
import { myanmarTownships } from "@common/system/countries/myanmar/MyanmarTownship"
import RcdaChatLocalizer from "@/chat/localization/RcdaChatLocalizer";

export const askUserInfoDialog = rcdaChatDialog(
    "/askUserInfo",
    null,
    [
        ({ session }) => {
            Prompts.text(session, "What township are you reporting on?");
        },
        ({ session, result: { response } }) => {
            // TODO validate against list of myanmar townships in /common/src/system/countries/myanmar/MyanmarTownships
            session.conversationData.mm.townshipId = response;

            //TODO get full list of disaster types
            Prompts.choice(session, "What is the disaster type?", ["Flood", "Earthquake", "Other (TODO)"], { listStyle: ListStyle.button });
        },
        ({ session, result }) => {
            session.conversationData.mm.disasterTypeId = result.response.entity;
            Prompts.choice(session, "What is the setting?", GeographicalSettings.map(x => x.name.en), { listStyle: ListStyle.button });
        },
        ({ session, result }) => {
            session.conversationData.mm.geographicalSettingId = GeographicalSettings.find(x => x.name.en === result.response.entity).id;
            session.endDialog();
        }
    ]);

export const confirmUserAdminStack = rcdaChatDialog(
    "/confirmUserAdminStack",
    null,
    [
        ({ session, localizer, next }) => {
            const currentAdminStack:string = session.userData.adminStack;
            if (currentAdminStack) {
                Prompts.choice(
                    session,
                    `The current admin stack selected is - ${currentAdminStack}. Do you want to change it?`,
                    [localizer.common.yes,localizer.common.no]);
            } else {
                next();
            }
        },
        ({ session, result, localizer, next}) => {
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
        ({ session, localizer ,next }) => {
            RcdaPrompts.adaptiveCard(session,createAdaptiveCardforRegions(localizer));
        },
        ({ session, localizer, result}) => {
            const selectedRegion:string = result.region;
            RcdaPrompts.adaptiveCard(session,createAdaptiveCardForDistricts(localizer,selectedRegion));
        },
        ({ session, localizer, result}) => {
            const selectedDistrict:string = result.district;
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

    const myanmarRegionArray:Array<string> = Array.from(myanmarRegionSet).sort();

    const myanmarRegionChoices:Array<object> = new Array();
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

function createAdaptiveCardForDistricts(localizer: RcdaChatLocalizer,region:string) {
    const adaptiveCardBody:Array<object> = [
        {
            "type": "TextBlock",
            "size": "medium",
            "weight": "default",
            "text": localizer.mm.askAdminStackDistrictName,
            "horizontalAlignment": "left"
        }
    ];

    const myanmarDistrictSet:Set<string> = new Set();
    
    myanmarTownships.forEach(myanmarTownship => {
        if (myanmarTownship.regionName === region) {
            myanmarDistrictSet.add(myanmarTownship.districtName);
        }
    });

    const myanmarDistrictArray:Array<string> = Array.from(myanmarDistrictSet).sort();

    const myanmarDistrictChoices:Array<object> = new Array();
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
                "type": localizer.mm.submitCard,
                "title": "Submit",
            }
        ]
    };
}

function createAdaptiveCardForTownships(localizer:RcdaChatLocalizer,district:string) {
    const adaptiveCardBody:Array<object> = [
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

    const myanmarTownshipArray:Array<string> = Array.from(myanmarTownshipSet).sort();

    const myanmarTownshipChoices:Array<object> = new Array();
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
                "type": localizer.mm.submitCard,
                "title": "Submit",
            }
        ]
    };
}