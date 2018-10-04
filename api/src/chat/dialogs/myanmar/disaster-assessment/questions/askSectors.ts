import { Message } from "botbuilder";
import rcdaChatDialog from "@/chat/utils/rcdaChatDialog";
import { RcdaTypedSession, RcdaChatStep } from "@/chat/utils/rcda-chat-types";
import { reviewSectorsDialog } from "@/chat/dialogs/myanmar/disaster-assessment/review/reviewSectorsDialog";
import RcdaPrompts from "@/chat/prompts/RcdaPrompts";
import { Sectors } from "@/chat/dialogs/myanmar/disaster-assessment/utils/Sectors"
import { SectorFactors } from "@/chat/dialogs/myanmar/disaster-assessment/utils/SectorFactors"
import { SectorSeverityScale } from "@/chat/dialogs/myanmar/disaster-assessment/utils/SectorSeverityScale"
import { SectorFactorImpactScale } from "@/chat/dialogs/myanmar/disaster-assessment/utils/SectorFactorImpactScale"
import { SectorBasicNeedsConcernScale } from "@/chat/dialogs/myanmar/disaster-assessment/utils/SectorBasicNeedsConcernScale"

export const askSectorsDialog = rcdaChatDialog(
    "/askSectors",
    null,
    [        
        ({ session, result }) => {
            session.send("Which sectors can you report on?");
            RcdaPrompts.adaptiveCard(session, createAdaptiveCardForAskSectorsToReport(session));
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
        ({ session, result: sector }: RcdaChatStep<string>) => {
            RcdaPrompts.adaptiveCard(session, createAdaptiveCardForAskSector(session, sector))
        },
        ({ session, result: { response } }) => {

            let sectorsData = session.conversationData.mm.sectors;
            
            // remove existing entry for this sector
            sectorsData.completedSectors = sectorsData.completedSectors.filter(x => x.id !== response.sectorId);

            function getFactorScore(id: string) { 
                let factorResponse = response[`factors-${id}`];
                return factorResponse === placeholder ? null : factorResponse;
            }
            // add sector
            sectorsData.completedSectors.push({
                id: response.sectorId,
                severity: response.severity === placeholder ? null : response.severity,
                factors: SectorFactors.map(factor => ({ id: factor.id, factorScore: getFactorScore(factor.id) })),
                basicNeedsConcern: response.basicNeedsConcern === placeholder ? null : response.basicNeedsConcern
            });

            session.endDialog();
        }
    ]);

const placeholder = "Choose..."

function createAdaptiveCardForAskSectorsToReport(session: any): Message {
    let choices = Sectors.map(sector => ({
        title: sector.name.en,
        value: sector.id
    }));
    const sectorAdaptiveCard: Message = new Message(session).addAttachment({
        contentType: "application/vnd.microsoft.card.adaptive",
        content: {
            type: "AdaptiveCard",
            body: [
                {
                    "type": "Input.ChoiceSet",
                    "id": "sectors",
                    "isMultiSelect": true,
                    "placeholder": "Choose...",
                    "choices": [...choices]
                }
            ],
            actions: [
                {
                    "type": "Action.Submit",
                    "title": "Save"
                }
            ]
        }
    });
    return sectorAdaptiveCard;
}

function createAdaptiveCardForAskSector(session: RcdaTypedSession, sectorId: string): Message {
    
    const adaptiveCardChoices = SectorSeverityScale.map(x => ({
        title: `${x.value} - ${x.label.en}`,
        value: x.value
    }));

    const factorSeverityScaleChoices = SectorFactorImpactScale.map(x => ({
        title: `${x.value} - ${x.label.en}`,
        value: x.value
    }));

    const basicNeedsConcernChoices = SectorBasicNeedsConcernScale.map(x => ({
        title: `${x.value} - ${x.label.en}`,
        value: x.value
    }));

    let adaptiveCardBody:Array<object> = [];
    adaptiveCardBody.push(
        {
            "type": "TextBlock",
            "size": "large",
            "weight": "bolder",
            "text": Sectors.find(x => x.id === sectorId).name.en,
            "horizontalAlignment": "left"
        },
        // severity
        {
            "type": "TextBlock",
            "size": "medium",
            "weight": "default",
            "text": "Severity",
            "horizontalAlignment": "left"
        },
        {
            "type": "Input.ChoiceSet",
            "id": "severity",
            "style": "compact",
            "placeholder": "Choose...",
            "choices": adaptiveCardChoices
        });
    adaptiveCardBody.push({
        "type": "TextBlock",
        "size": "medium",
        "weight": "default",
        "text": "Factors",
        "horizontalAlignment": "left"
    })
    // main concerns (iterate over each factor, add fields per type)
    SectorFactors.forEach(factor => adaptiveCardBody.push(
        {
            "type": "TextBlock",
            "size": "default",
            "weight": "default",
            "text": factor.name.en,
            "horizontalAlignment": "left"
        },
        {
            "type": "Input.ChoiceSet",
            "id": `factors-${factor.id}`,
            "style": "compact",
            "placeholder": "Choose...",
            "choices": factorSeverityScaleChoices
        }));
    // basic needs concern
    adaptiveCardBody.push(
        {
            "type": "TextBlock",
            "size": "medium",
            "weight": "default",
            "text": "Basic Needs",
            "horizontalAlignment": "left"
        },
        {
            "type": "TextBlock",
            "size": "default",
            "weight": "default",
            "text": "Without additional assistance, are you worried about your ability to meet your basic needs for this sector in the next 3 months?",
            "horizontalAlignment": "left",
            "wrap": true
        },
        {
            "type": "Input.ChoiceSet",
            "id": "basicNeedsConcern",
            "style": "compact",            
            "placeholder": "Choose...",
            "choices": basicNeedsConcernChoices
        });

    const sectorSeverityAdaptiveCard:Message = new Message(session).addAttachment({
        contentType: "application/vnd.microsoft.card.adaptive",
        content: {
            type: "AdaptiveCard",
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
        }
    });

    return sectorSeverityAdaptiveCard;
}