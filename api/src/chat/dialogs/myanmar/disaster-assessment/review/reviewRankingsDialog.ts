import rcdaChatDialog from "@/chat/utils/rcdaChatDialog";
import { RcdaTypedSession } from "@/chat/utils/rcda-chat-types";
import { RcdaChatDialog } from "@/chat/utils/rcda-chat-types";
import RcdaPrompts from "@/chat/prompts/RcdaPrompts";
import * as askRankings from "@/chat/dialogs/myanmar/disaster-assessment/questions/askRankings";
import RcdaChatLocalizer from "@/chat/localization/RcdaChatLocalizer";

export const reviewRankingsDialog: RcdaChatDialog = rcdaChatDialog(
    "/reviewRankings",
    null,
    [
        ({ session, localizer }) => {
            RcdaPrompts.adaptiveCardBuilder(session, createRankingsReviewCard(session, localizer));
        },
        ({ session, result }) => {
            const userChoice: string = result.response.id;
            if (userChoice === "edit") {
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

function createRankingsReviewCard(session: RcdaTypedSession, localizer: RcdaChatLocalizer) {

    const adaptiveCardBody: object[] = [
        {
            "type": "TextBlock",
            "size": "medium",
            "weight": "default",
            "text": localizer.mm.reviewSectionHeader(localizer.mm.reportSectionNameRankings),
            "horizontalAlignment": "left"
        }
    ];

    type Ranking = { value: string; rank: number; };
    function addRanking(rankings: Ranking[], name: string, definition: any) {
        //sort
        rankings = rankings.sort((x, y) => x.rank - y.rank);
        adaptiveCardBody.push({
            "type": "TextBlock",
            "size": "medium",
            "weight": "bolder",
            "text": name,
            "separator": true,
            "horizontalAlignment": "left"
        }, {
            "type": "FactSet",
            "facts": rankings.map(ranking => ({
                title: `${ranking.rank} -`,
                value: ranking.value ? definition[ranking.value] : localizer.mm.reviewSectionNoResponseValue
            }))
        });
    }

    let rankingsData = session.conversationData.mm.rankings;
    addRanking(rankingsData.affectedGroups, localizer.mm.rankingSectionAffectedGroupsTitle, localizer.mm.affectedGroups);
    addRanking(rankingsData.prioritySectors, localizer.mm.rankingSectionPrioritySectorsTitle, localizer.mm.sectors);
    addRanking(rankingsData.vulnerableGroups, localizer.mm.rankingSectionVulnerableGroupsTitle, localizer.mm.vulnerableGroups);
    addRanking(rankingsData.responseModalities, localizer.mm.rankingSectionResponseModalitiesTitle, localizer.mm.responseModalities);

    return {
        body: adaptiveCardBody,
        actions: [
            {
                "type": "Action.Submit",
                "title": "Edit",
                "data": {
                    "id": "edit"
                }
            },
            {
                "type": "Action.Submit",
                "title": "Accept",
                "data": {
                    "id": "accept"
                }
            }
        ]
    };
}