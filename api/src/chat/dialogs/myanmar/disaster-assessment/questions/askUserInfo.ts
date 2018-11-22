import { Prompts, ListStyle } from "botbuilder";
import rcdaChatDialog from "@/chat/utils/rcdaChatDialog";
import { MyanmarGeographicalSettings } from "@common/models/resources/disaster-assessment/enums/MyanmarGeographicalSettings";

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
        ({ session, localizer, result }) => {
            session.conversationData.mm.disasterTypeId = result.response.entity;
            Prompts.choice(session, localizer.mm.askGeographicalSettingType, Object.values(localizer.mm.geographicalSettings), { listStyle: ListStyle.button });
        },
        ({ session, localizer, result }) => {
            console.log("!!!!!!!!!"+JSON.stringify(result));
            session.conversationData.mm.geographicalSettingId = Object.keys(localizer.mm.geographicalSettings)[result.index] as MyanmarGeographicalSettings;
            console.log(session.conversationData.mm.geographicalSettingId);
            //TODO this isn't working
            session.endDialog();
        }
    ]);