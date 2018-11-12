import { Prompts,ListStyle,TextFormat } from "botbuilder";
import rcdaChatDialog from "@/chat/utils/rcdaChatDialog";
import { GeographicalSettings } from "@/chat/dialogs/myanmar/disaster-assessment/utils/GeographicalSettings"

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