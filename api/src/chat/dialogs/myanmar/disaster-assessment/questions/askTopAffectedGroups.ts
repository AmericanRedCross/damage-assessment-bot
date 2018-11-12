import { Message } from "botbuilder";
import { RcdaTypedSession } from "@/chat/utils/rcda-chat-types";
import rcdaChatDialog from "@/chat/utils/rcdaChatDialog";
import RcdaPrompts from "@/chat/prompts/RcdaPrompts";
import { AffectedGroups } from "@/chat/dialogs/myanmar/disaster-assessment/utils/AffectedGroups";

export const askTopAffectedGroupsDialog = rcdaChatDialog(
    "/askTopAffectedGroups",
    null,
    [
        ({ session }) => {
            session.send(`Who are the top 3 affected groups that require immediate assistance in this area?`);
            RcdaPrompts.adaptiveCard(session, createAdaptiveCardForAffectedGroups(session));
        },
        ({ session, result: { response } }) => {

            const getAffactedGroup = (rank: number) => ({ value: response[`affectedGroup${rank}`], rank: rank });

            session.conversationData.mm.rankings.affectedGroups = [
                getAffactedGroup(1),
                getAffactedGroup(2),
                getAffactedGroup(3),
            ];
            
            session.endDialog();
        }
    ]);

function createAdaptiveCardForAffectedGroups(session: RcdaTypedSession): Message {
   
    const affectedGroupsChoices = AffectedGroups.map(x => ({
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
                "text": `Affected Group #${i}`,
                "horizontalAlignment": "left"
            },
            {
                "type": "Input.ChoiceSet",
                "id": `affectedGroup${i}`,
                "style": "compact",
                "placeholder": "Choose...",
                "choices": affectedGroupsChoices
            }
        );
    }

    const affectedGroupsAdaptiveCard: Message = new Message(session).addAttachment({
        contentType: "application/vnd.microsoft.card.adaptive",
        content: {
            type: "AdaptiveCard",
            body: adaptiveCardBody,
            actions: [
                {
                    "type": "Action.Submit",
                    "title": "Save"
                }
            ]
        }
    });

    return affectedGroupsAdaptiveCard;
}