import { Prompts,ListStyle,TextFormat, Message } from "botbuilder";
import rcdaChatDialog from "@/chat/utils/rcdaChatDialog";
import { RcdaTypedSession } from "@/chat/utils/rcda-chat-types";
import RcdaPrompts from "@/chat/prompts/RcdaPrompts";
import { VulnerableGroups } from "@/chat/dialogs/myanmar/disaster-assessment/utils/VulnerableGroups";

export const askTopVulnerableGroupsDialog = rcdaChatDialog(
    "/askTopVulnerableGroups",
    null,
    [
        ({ session }) => {
            session.send(`What are the top 3 vulnerable groups requiring immediate assistance in this area?`);
            RcdaPrompts.adaptiveCard(session, createAdaptiveCardForVulnerableGroups(session));
        },
        ({ session, result: { response } }) => {

            const getVulnerableGroup = (rank: number) => ({ value: response[`vulnerableGroup${rank}`], rank: rank });

            session.conversationData.mm.rankings.vulnerableGroups = [
                getVulnerableGroup(1),
                getVulnerableGroup(2),
                getVulnerableGroup(3),
            ];
            
            session.endDialog();
        }
    ]);

function createAdaptiveCardForVulnerableGroups(session: RcdaTypedSession):Message {
    
    const vulnerableGroupChoices = VulnerableGroups.map(x => ({
        title: `${x.name.en}`,
        value: `${x.id}`
    }));

    const adaptiveCardBody: object[] = [];
    for (let i: number = 1; i <= 3; i++) {
        adaptiveCardBody.push({
            "type": "TextBlock",
            "size": "medium",
            "weight": "bolder",
            "text": `Vulnerable Group #${i}`,
            "horizontalAlignment": "left"
        }, {
            "type": "Input.ChoiceSet",
            "id": `vulnerableGroup${i}`,
            "style": "compact",
            "placeholder": "Choose...",
            "choices": vulnerableGroupChoices
        });
    }
         
    const vulnerableGroupsAdaptiveCard:Message = new Message(session).addAttachment({
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

    return vulnerableGroupsAdaptiveCard;
}