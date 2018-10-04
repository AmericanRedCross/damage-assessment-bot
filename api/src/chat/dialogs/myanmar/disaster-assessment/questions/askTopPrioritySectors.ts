import { Message } from "botbuilder";
import { RcdaTypedSession } from "@/chat/utils/rcda-chat-types";
import rcdaChatDialog from "@/chat/utils/rcdaChatDialog";
import RcdaPrompts from "@/chat/prompts/RcdaPrompts";
import { Sectors } from "@/chat/dialogs/myanmar/disaster-assessment/utils/Sectors"

export const askTopPrioritySectorsDialog = rcdaChatDialog(
    "/askTopPrioritySectors",
    null,
    [
        ({ session }) => {
            session.send(`What are the top 3 priority sectors requiring immediate assistance in this area?`);
            RcdaPrompts.adaptiveCard(session, createAdaptiveCardForPrioritySectors(session));
        },
        ({ session, result: { response } }) => {

            const getPrioritySector = (rank: number) => ({ value: response[`prioritySector${rank}`], rank: rank });

            session.conversationData.mm.rankings.prioritySectors = [
                getPrioritySector(1),
                getPrioritySector(2),
                getPrioritySector(3),
            ];
            
            session.endDialog();
        }
    ]
);

function createAdaptiveCardForPrioritySectors(session: RcdaTypedSession):Message {
    
    const prioritySectorChoices = Sectors.map(x => ({
        title: `${x.name.en}`,
        value: `${x.id}`
    }));

    const adaptiveCardBody: object[] = [];
    for (let i: number = 1; i <= 3; i++) {
        adaptiveCardBody.push(
            {
                "type": "TextBlock",
                "size": "medium",
                "weight": "bolder",
                "text": `Priority Sector #${i}`,
                "horizontalAlignment": "left"
            },
            {
                "type": "Input.ChoiceSet",
                "id": `prioritySector${i}`,
                "style": "compact",
                "placeholder": "Choose...",
                "choices": prioritySectorChoices
            }
        );
    }

    const prioritySectorsAdaptiveCard:Message = new Message(session).addAttachment({
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

    return prioritySectorsAdaptiveCard;
}