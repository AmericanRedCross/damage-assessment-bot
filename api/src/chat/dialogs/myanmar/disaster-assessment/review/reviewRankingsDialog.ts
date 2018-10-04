import { Message } from "botbuilder";
import rcdaChatDialog from "@/chat/utils/rcdaChatDialog";
import { RcdaTypedSession } from "@/chat/utils/rcda-chat-types";
import { RcdaChatDialog } from "@/chat/utils/rcda-chat-types";
import RcdaPrompts from "@/chat/prompts/RcdaPrompts";
import * as askRankings from "@/chat/dialogs/myanmar/disaster-assessment/questions/askRankings";
import { AffectedGroups } from "@/chat/dialogs/myanmar/disaster-assessment/utils/AffectedGroups";
import { Sectors } from "@/chat/dialogs/myanmar/disaster-assessment/utils/Sectors"
import { ResponseModalities } from "@/chat/dialogs/myanmar/disaster-assessment/utils/ResponseModalities";
import { VulnerableGroups } from "@/chat/dialogs/myanmar/disaster-assessment/utils/VulnerableGroups";

export const reviewRankingsDialog: RcdaChatDialog = rcdaChatDialog(
    "/reviewRankings",
    null,
    [
        ({ session }) => {
            RcdaPrompts.adaptiveCard(session, createRankingsReviewCard(session));
        },
        ({ session, result }) => {
            const userChoice: string = result.response.id;
            if (userChoice && userChoice.toLowerCase() === "edit") {
                session.beginDialog(askRankings.askRankingsDialog.id);
            } else {
                session.endDialog();
            }
        }
    ],
    {
        references: () => [
            askRankings.askRankingsDialog
        ]
    });

function createRankingsReviewCard(session: RcdaTypedSession): Message {

    const adaptiveCardBody: object[] = [
        {
            "type": "TextBlock",
            "size": "medium",
            "weight": "default",
            "text": `Please review **Rankings**`,
            "horizontalAlignment": "left"
        }
    ];

    type Ranking = { value: string; rank: number; };
    function addRanking(ranking: Ranking[], name: string, definition: { id: string, name: { en: string } }[]) {
        adaptiveCardBody.push({
            "type": "TextBlock",
            "size": "medium",
            "weight": "bolder",
            "text": `${name}`,
            "separator": true,
            "horizontalAlignment": "left"
        }, {
            "type": "FactSet",
            "facts": ranking.sort((x, y) => x.rank - y.rank).map(x => ({
                title: `${x.rank} -`,
                value: (definition.find(d => d.id === x.value) || { name: { en: "No Response" /*TODO validation?*/}}).name.en
            }))
        });
    }

    addRanking(session.conversationData.mm.rankings.affectedGroups, "Affected Groups", AffectedGroups);
    addRanking(session.conversationData.mm.rankings.prioritySectors, "Priority Sectors", Sectors);
    addRanking(session.conversationData.mm.rankings.vulnerableGroups, "Vulnerable Groups", VulnerableGroups);
    addRanking(session.conversationData.mm.rankings.responseModalities, "Response Modalities", ResponseModalities);

    const affectedPeopleReviewCard = new Message(session).addAttachment({
        contentType: "application/vnd.microsoft.card.adaptive",
        content: {
            type: "AdaptiveCard",
            body: adaptiveCardBody,
            actions: [
                {
                    "type": "Action.Submit",
                    "title": "Edit",
                    "data": {
                        "id": "Edit"
                    }
                },
                {
                    "type": "Action.Submit",
                    "title": "Accept",
                    "data": {
                        "id": "Accept"
                    }
                }
            ]
        }
    });

    return affectedPeopleReviewCard;
}