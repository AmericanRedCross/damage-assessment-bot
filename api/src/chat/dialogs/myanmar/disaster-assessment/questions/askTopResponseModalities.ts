import { Message } from "botbuilder";
import { RcdaTypedSession } from "@/chat/utils/rcda-chat-types";
import rcdaChatDialog from "@/chat/utils/rcdaChatDialog";
import RcdaPrompts from "@/chat/prompts/RcdaPrompts";
import { ResponseModalities } from "@/chat/dialogs/myanmar/disaster-assessment/utils/ResponseModalities";

export const askTopResponseModalitiesDialog = rcdaChatDialog(
    "/askTopResponseModalities",
    null,
    [
        ({ session }) => {
            session.send(`What are the top 3 response modalities you would favour?`);
            RcdaPrompts.adaptiveCard(session, createAdaptiveCardForResponseModalities(session));
        },
        ({ session, result: { response } }) => {

            const getResponseModality = (rank: number) => ({ value: response[`responseModality${rank}`], rank: rank });

            session.conversationData.mm.rankings.responseModalities = [
                getResponseModality(1),
                getResponseModality(2),
                getResponseModality(3),
            ];
            
            session.endDialog();
        }
    ]
);

function createAdaptiveCardForResponseModalities(session: RcdaTypedSession): Message {
    
    const responseModalityChoices = ResponseModalities.map(x => ({
        title: `${x.name.en}`,
        value: `${x.id}`
    }));

    const adaptiveCardBody: object[] = [];
    for (let i: number = 1; i <= 3; i++) {
        adaptiveCardBody.push({
            "type": "TextBlock",
            "size": "medium",
            "weight": "bolder",
            "text": `Response Modality #${i}`,
            "horizontalAlignment": "left"
        }, {
            "type": "Input.ChoiceSet",
            "id": `responseModality${i}`,
            "style": "compact",
            "placeholder": "Choose...",
            "choices": responseModalityChoices
        });
    }
         
    const responseModalitiesAdaptiveCard: Message = new Message(session).addAttachment({
        contentType: "application/vnd.microsoft.card.adaptive",
        content: {
            type: "AdaptiveCard",
            body: [...adaptiveCardBody],
            actions: [
                {
                    "type": "Action.Submit",
                    "title": "Save"
                }
            ]
        }
    });

    return responseModalitiesAdaptiveCard;
}