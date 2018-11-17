import rcdaChatDialog, { rcdaChatDialogStateful } from "@/chat/utils/rcdaChatDialog";
import RcdaPrompts from "@/chat/prompts/RcdaPrompts";
import RcdaChatLocalizer, { RcdaMyanmarText } from "@/chat/localization/RcdaChatLocalizer";
import { RcdaTypedSession } from "@/chat/utils/rcda-chat-types";
import RcdaBotConversationData from "@/chat/models/RcdaBotConversationData";
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
        }
    ],
    {
        references: () => [ askIndividualRankingDialog ]
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
            let choiceData = localizer.mm[session.dialogData.choiceDataLocalizerProperty] as any;

            session.send(askRankingPromptText);
            RcdaPrompts.adaptiveCardBuilder(session, createAdaptiveCardForRankingSection(localizer, choiceData, inputLabelGetter));
        },
        ({ session, result: { response } }) => {

            session.conversationData.mm.rankings[session.dialogData.rankingResultProperty] = getRankings(response);
            
            session.endDialog();
        }
    ]
);

function getRankings(response: any): MyanmarRankingInput<any>[] {
    const getRanking = (rank: number) => ({ value: response[`ranking${rank}`], rank: rank });

    return [
        getRanking(1),
        getRanking(2),
        getRanking(3),
    ];
}

function createAdaptiveCardForRankingSection(localizer: RcdaChatLocalizer, choiceData: any, getInputLabelText: (rank: string) => string) {
    
    const choices = Object.keys(choiceData).map(id => ({
        title: choiceData[id],
        value: id
    }));

    const adaptiveCardBody: object[] = [];
    for (let i: number = 1; i <= 3; i++) {
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
            "choices": choices
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