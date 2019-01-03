import rcdaChatDialog, { rcdaChatDialogStateful } from "@/chat/utils/rcdaChatDialog";
import RcdaPrompts from "@/chat/prompts/RcdaPrompts";
import RcdaChatLocalizer, { RcdaMyanmarText } from "@/chat/localization/RcdaChatLocalizer";
import { RcdaTypedSession } from "@/chat/utils/rcda-chat-types";
import  { reviewRankingsDialog } from "@/chat/dialogs/myanmar/disaster-assessment/review/reviewRankingsDialog";
import { MyanmarRankingSectionInput,MyanmarRankingInput } from "@/chat/models/MyanmarConversationData";

type AskRankingsConfiguration = {
    askRankingsPromptLocalizerProperty: keyof RcdaMyanmarText;
    rankingInputLabelLocalizerProperty: keyof RcdaMyanmarText;
    choiceDataLocalizerProperty: keyof RcdaMyanmarText;
    rankingResultProperty: keyof MyanmarRankingSectionInput;
}

export const askRankingsDialog = rcdaChatDialog(
    "/askRankings",
    null,
    [                
        ({ session }) => {
            // Affected Groups
            beginAskIndividualRankingDialog(session, {
                askRankingsPromptLocalizerProperty: "askTop3AffectedGroups",
                rankingInputLabelLocalizerProperty: "affectedGroupsRankingInputLabel",
                choiceDataLocalizerProperty: "affectedGroups",
                rankingResultProperty: "affectedGroups"
            });
        },
        ({ session }) => {
            // Priority Sectors
            beginAskIndividualRankingDialog(session, {
                askRankingsPromptLocalizerProperty: "askTop3PrioritySectors",
                rankingInputLabelLocalizerProperty: "prioritySectorsRankingInputLabel",
                choiceDataLocalizerProperty: "sectors",
                rankingResultProperty: "prioritySectors"
            });
        },
        ({ session }) => {
            // Vulnerable Groups
            beginAskIndividualRankingDialog(session, {
                askRankingsPromptLocalizerProperty: "askTop3VulnerableGroups",
                rankingInputLabelLocalizerProperty: "vulnerableGroupsRankingInputLabel",
                choiceDataLocalizerProperty: "vulnerableGroups",
                rankingResultProperty: "vulnerableGroups"
            });
        },
        ({ session }) => {
            // Response Modalities
            beginAskIndividualRankingDialog(session, {
                askRankingsPromptLocalizerProperty: "askTop3ResponseModalities",
                rankingInputLabelLocalizerProperty: "responseModalityRankingInputLabel",
                choiceDataLocalizerProperty: "responseModalities",
                rankingResultProperty: "responseModalities"
            });
        },
        ({ session }) => {
            session.beginDialog(reviewRankingsDialog.id)
        }
    ],
    {
        references: () => [ 
            askIndividualRankingDialog,
            reviewRankingsDialog
        ]
    }
);

function beginAskIndividualRankingDialog(session: RcdaTypedSession, config: AskRankingsConfiguration) {
    session.beginDialog(askIndividualRankingDialog.id, config);
}

export const askIndividualRankingDialog = rcdaChatDialogStateful(
    "/askIndividualRanking",
    null,
    ({ result }: { result: AskRankingsConfiguration }) => result,
    [
        ({ session, localizer }) => {
            let askRankingPromptText = localizer.mm[session.dialogData.askRankingsPromptLocalizerProperty] as string;
            let inputLabelGetter = localizer.mm[session.dialogData.rankingInputLabelLocalizerProperty] as (rank: string) => string;
            let rankingData = session.conversationData.mm.rankings[session.dialogData.rankingResultProperty];
            let choiceData = localizer.mm[session.dialogData.choiceDataLocalizerProperty] as any;

            session.send(askRankingPromptText);
            RcdaPrompts.adaptiveCard(session, createAdaptiveCardForRankingSection(localizer, rankingData, choiceData, inputLabelGetter));
        },
        ({ session, result: { response }, localizer }) => {

            session.conversationData.mm.rankings[session.dialogData.rankingResultProperty] = getRankings(response, localizer.common.selectDropdownPlaceholder);
            
            session.endDialog();
        }
    ]
);

function getRankings(response: any, placeholderValue: string): MyanmarRankingInput<any>[] {
    const getRanking = (rank: number) => {
        let result = ({ value: response[`ranking${rank}`], rank: rank });
        if (result.value === placeholderValue) {
            result.value = null;
        }
        return result;
    }

    return [
        getRanking(1),
        getRanking(2),
        getRanking(3),
    ];
}

function createAdaptiveCardForRankingSection(localizer: RcdaChatLocalizer, rankingData: MyanmarRankingInput<any>[], choiceData: any, getInputLabelText: (rank: string) => string) {
    
    const choices = Object.keys(choiceData).map(id => ({
        title: choiceData[id],
        value: id
    }));

    const adaptiveCardBody: object[] = [];
    for (let i: number = 1; i <= 3; i++) {
        let currentValue = rankingData.find(x => x.rank === i);
        adaptiveCardBody.push({
            "type": "TextBlock",
            "size": "medium",
            "weight": "bolder",
            "text": getInputLabelText(localizer.common.formatNumber(i)),
            "horizontalAlignment": "left"
        }, {
            "type": "Input.ChoiceSet",
            "id": `ranking${i}`,
            "style": "compact",
            "placeholder": localizer.common.selectDropdownPlaceholder,
            "choices": choices,
            "value": currentValue ? currentValue.value : null
        });
    }
    
    return {
        body: adaptiveCardBody,
        actions: [
            {
                "type": "Action.Submit",
                "title": "Save"
            }
        ]
    };
}