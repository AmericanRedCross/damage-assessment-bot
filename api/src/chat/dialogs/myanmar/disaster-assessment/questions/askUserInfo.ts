import { Prompts, ListStyle } from "botbuilder";
import rcdaChatDialog from "@/chat/utils/rcdaChatDialog";
import { MyanmarGeographicalSettings } from "@common/models/resources/disaster-assessment/enums/MyanmarGeographicalSettings";
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