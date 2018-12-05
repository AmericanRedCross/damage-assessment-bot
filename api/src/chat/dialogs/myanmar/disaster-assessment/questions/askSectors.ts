import rcdaChatDialog from "@/chat/utils/rcdaChatDialog";
import { reviewSectorsDialog } from "@/chat/dialogs/myanmar/disaster-assessment/review/reviewSectorsDialog";
import RcdaPrompts from "@/chat/prompts/RcdaPrompts";
import RcdaChatLocalizer from "@/chat/localization/RcdaChatLocalizer";
import { MyanmarSectorFactors } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarSectorFactors";
import { MyanmarSectorFactorImpactScale } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarSectorFactorImpactScale";
import { MyanmarSectorInput } from "@/chat/models/MyanmarConversationData";
import { getKeys } from "@common/utils/objectHelpers";
import { MyanmarSectors } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarSectors";

export const askSectorsDialog = rcdaChatDialog(
    "/askSectors",
    null,
    [        
        ({ session, localizer }) => {
            RcdaPrompts.adaptiveCard(session, createAdaptiveCardForAskSectorsToReport(localizer, session.conversationData.mm.sectors.selectedSectorIds));
        },
        ({ session, result }) => {
            session.conversationData.mm.sectors.selectedSectorIds = result.response.sectors.split(",");

            session.beginDialog(askUncompletedSectorsDialog.id);
        },
        ({ session }) => {
            session.beginDialog(reviewSectorsDialog.id)
        }
    ], {
        references: () => [
            askUncompletedSectorsDialog,
            reviewSectorsDialog
        ]
    });

export const askUncompletedSectorsDialog = rcdaChatDialog(
    "/askUncompletedSectors",
    null,
    [   
        ({ session }) => {
            let { selectedSectorIds, completedSectors } = session.conversationData.mm.sectors;
            let completedSectorIds = completedSectors.map(x => x.id);

            // find next sector that has not been completed
            let nextSector = selectedSectorIds.find(x => !completedSectorIds.includes(x));
            if (nextSector) {
                session.beginDialog(askIndividualSectorDialog.id, nextSector)
            }
            else {
                session.endDialog();
            }
        },
        ({ session }) => {
            // start over, look for next sector
            session.replaceDialog(askUncompletedSectorsDialog.id);
        }
    ], {
        references: () => [
            askIndividualSectorDialog,
            reviewSectorsDialog
        ]
    });

export const askIndividualSectorDialog = rcdaChatDialog(
    "/askIndividualSector",
    null,
    [
        ({ session, localizer, result: sectorId }) => {
            let currentData = session.conversationData.mm.sectors.completedSectors.find(x => x.id === sectorId);
            RcdaPrompts.adaptiveCard(session, createAdaptiveCardForAskSector(localizer, currentData, sectorId));
        },
        ({ session, localizer, result: { response } }) => {

            const placeholder = localizer.common.selectDropdownPlaceholder;
            let sectorsData = session.conversationData.mm.sectors;
            
            // remove existing entry for this sector
            sectorsData.completedSectors = sectorsData.completedSectors.filter(x => x.id !== response.sectorId);

            function getFactorScore(id: string): MyanmarSectorFactorImpactScale { 
                let factorResponse = response[`factors-${id}`];
                return (factorResponse === placeholder ? null : factorResponse) as MyanmarSectorFactorImpactScale;
            }
            // add sector
            sectorsData.completedSectors.push({
                id: response.sectorId,
                severity: response.severity === placeholder ? null : response.severity,
                factors: Object.keys(localizer.mm.sectorFactors).map(factor => ({ 
                    id: factor as MyanmarSectorFactors, 
                    factorScore: getFactorScore(factor)
                })),
                basicNeedsConcern: response.basicNeedsConcern === placeholder ? null : response.basicNeedsConcern
            });

            session.endDialog();
        }
    ]);

function createAdaptiveCardForAskSectorsToReport(localizer: RcdaChatLocalizer, selectedSectorIds: MyanmarSectors[]) {
    let choices = getKeys(localizer.mm.sectors).map(sectorId => ({
        title: localizer.mm.sectors[sectorId],
        value: sectorId
    }));

    return {
        body: [
            {
                "type": "TextBlock",
                "size": "large",
                "weight": "default",
                "text": localizer.mm.sectorSelectionHeader,
                "horizontalAlignment": "left"
            },
            {
                "type": "Input.ChoiceSet",
                "id": "sectors",
                "separator": true,
                "isMultiSelect": true,
                "placeholder": localizer.common.selectDropdownPlaceholder,
                "choices": choices,
                "value": selectedSectorIds.join(",")
            }
        ],
        actions: [
            {
                "type": "Action.Submit",
                "title": localizer.mm.submitCard
            }
        ]
    };
}

function createAdaptiveCardForAskSector(localizer: RcdaChatLocalizer, sectorData: MyanmarSectorInput, sectorId: string) {
    
    sectorData = sectorData || new MyanmarSectorInput();

    const getChoices = (enumLabelMap: object) => Object.keys(enumLabelMap).map(enumValue => ({
        title: `${enumValue} - ${enumLabelMap[enumValue]}`,
        value: enumValue
    }));

    let adaptiveCardBody:Array<object> = [];
    adaptiveCardBody.push(
        {
            "type": "TextBlock",
            "size": "large",
            "weight": "bolder",
            "text": localizer.mm.sectors[sectorId],
            "horizontalAlignment": "left"
        },
        // severity
        {
            "type": "TextBlock",
            "size": "medium",
            "weight": "default",
            "text": localizer.mm.sectorSeverityQuestionHeader,
            "horizontalAlignment": "left"
        },
        {
            "type": "Input.ChoiceSet",
            "id": "severity",
            "style": "compact",
            "placeholder": localizer.common.selectDropdownPlaceholder,
            "choices": getChoices(localizer.mm.sectorSeverityScale),
            "value": sectorData.severity
        });
    adaptiveCardBody.push({
        "type": "TextBlock",
        "size": "medium",
        "weight": "default",
        "text": localizer.mm.sectorFactorsQuestionsHeader,
        "horizontalAlignment": "left"
    })
    // main concerns (iterate over each factor, add fields per type)
    getKeys(localizer.mm.sectorFactors).forEach(factorId => {
        let currentChoice = sectorData.factors.find(x => x.id === factorId);
        adaptiveCardBody.push(
        {
            "type": "TextBlock",
            "size": "default",
            "weight": "default",
            "text": localizer.mm.sectorFactors[factorId],
            "horizontalAlignment": "left"
        },
        {
            "type": "Input.ChoiceSet",
            "id": `factors-${factorId}`,
            "style": "compact",
            "placeholder": localizer.common.selectDropdownPlaceholder,
            "choices": getChoices(localizer.mm.sectorFactorImpactScale),
            "value": currentChoice ? currentChoice.factorScore : null
        });
    });
    // basic needs concern
    adaptiveCardBody.push(
        {
            "type": "TextBlock",
            "size": "medium",
            "weight": "default",
            "text": localizer.mm.sectorBasicNeedsQuestionHeader,
            "horizontalAlignment": "left"
        },
        {
            "type": "TextBlock",
            "size": "default",
            "weight": "default",
            "text": localizer.mm.sectorBasicNeedsQuestionLabel,
            "horizontalAlignment": "left",
            "wrap": true
        },
        {
            "type": "Input.ChoiceSet",
            "id": "basicNeedsConcern",
            "style": "compact",            
            "placeholder": localizer.common.selectDropdownPlaceholder,
            "choices": getChoices(localizer.mm.sectorBasicNeedsConcernScale),
            "value": sectorData.basicNeedsConcern
        });

    return {
        body: adaptiveCardBody,
        actions: [
            {
                "data": {
                    "sectorId": sectorId
                },
                "type": "Action.Submit",
                "title": "Save"
            }
        ]
    };
}