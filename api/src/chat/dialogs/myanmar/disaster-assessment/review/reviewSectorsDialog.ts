import { Message } from "botbuilder";
import { RcdaTypedSession } from "@/chat/utils/rcda-chat-types";
import rcdaChatDialog, { rcdaChatDialogStateful } from "@/chat/utils/rcdaChatDialog";
import { RcdaChatDialog, RcdaChatStep } from "@/chat/utils/rcda-chat-types";
import RcdaPrompts from "@/chat/prompts/RcdaPrompts";
import * as askSectors from "@/chat/dialogs/myanmar/disaster-assessment/questions/askSectors";
import { Sectors } from "@/chat/dialogs/myanmar/disaster-assessment/utils/Sectors";
import { SectorFactors } from "@/chat/dialogs/myanmar/disaster-assessment/utils/SectorFactors";
import { SectorFactorImpactScale } from "@/chat/dialogs/myanmar/disaster-assessment/utils/SectorFactorImpactScale";
import { SectorSeverityScale } from "@/chat/dialogs/myanmar/disaster-assessment/utils/SectorSeverityScale";
import { SectorBasicNeedsConcernScale } from "@/chat/dialogs/myanmar/disaster-assessment/utils/SectorBasicNeedsConcernScale";

// review list of selected sectors
// if edit, go back to start of edit sectors
// if accept, iterate through each sector and review

export const reviewSectorsDialog: RcdaChatDialog = rcdaChatDialog(
    "/reviewSectors",
    null,
    [
        ({ session, result }) => {
            RcdaPrompts.adaptiveCard(session, createAdaptiveCardForReviewSelectedSectors(session));
        },
        ({ session, result, next }) => {
            const userChoice: string = result.response.id;
            if (userChoice && userChoice.toLowerCase() === "edit") {
                session.replaceDialog(askSectors.askSectorsDialog.id);
            } else {
                session.beginDialog(reviewCompletedSectors.id)
            }
        }
    ], {
        references: () => [
            askSectors.askSectorsDialog,
            reviewCompletedSectors
        ]
    });

export const reviewCompletedSectors = rcdaChatDialogStateful(
    "/reviewCompletedSectors",
    null,
    class DialogData {
        currentSectorIndex: number;
    },
    [
        ({ session, result: currentSectorIndex = 0 }: RcdaChatStep<number>) => {
            session.dialogData.currentSectorIndex = currentSectorIndex;

            // find next sector that has not been reviewed
            let currentSectorId = session.conversationData.mm.sectors.selectedSectorIds[currentSectorIndex];
            if (currentSectorId) {
                session.beginDialog(reviewIndividualSectorDialog.id, currentSectorId)
            }
            else {
                session.endDialog();
            }
        },
        ({ session }) => {
            let nextSectorIndex = session.dialogData.currentSectorIndex + 1;
            // start over, look for next sector
            session.replaceDialog(reviewCompletedSectors.id, nextSectorIndex);
        }
    ], {
        references: () => [reviewIndividualSectorDialog]
    });

const reviewIndividualSectorDialog = rcdaChatDialogStateful(
    "/reviewIndividualSector",
    null,
    class DialogData {
        sector: string;
    },
    [
        ({ session, result: sector }: RcdaChatStep<string>) => {
            session.dialogData.sector = sector;
            RcdaPrompts.adaptiveCard(session, createAdaptiveCardForReviewIndividualSector(session, sector));
        },
        ({ session, result }) => {
            const userChoice: string = result.response.id;

            if (userChoice && userChoice.toLowerCase() === "edit") {
                session.beginDialog(askSectors.askIndividualSectorDialog.id, session.dialogData.sector);
            } else {
                session.endDialog();
            }
        },
        ({ session }) => {
            // now that they've edited, review again
            session.replaceDialog(reviewIndividualSectorDialog.id, session.dialogData.sector);
        }
    ], {
        references: () => [askSectors.askIndividualSectorDialog]
    });

function createAdaptiveCardForReviewSelectedSectors(session: RcdaTypedSession): Message {
    
    const adaptiveCardBody: object[] = [];

    adaptiveCardBody.push({
        "type": "TextBlock",
        "size": "medium",
        "weight": "default",
        "text": `Please confirm that this is the complete list of sectors you can report on`,
        "wrap": true,
        "horizontalAlignment": "left"
    });

    for (let sectorId of session.conversationData.mm.sectors.selectedSectorIds) {
        adaptiveCardBody.push({
            "type": "TextBlock",
            "size": "medium",
            "weight": "default",
            "text": `- ${Sectors.find(x => x.id == sectorId).name.en}`,
            "horizontalAlignment": "left"
        });
    }
    
    const sectorSelectionReviewCard: Message = new Message(session).addAttachment({
        contentType: "application/vnd.microsoft.card.adaptive",
        content: {
            type: "AdaptiveCard",
            body: [...adaptiveCardBody],
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

    return sectorSelectionReviewCard;
}

function createAdaptiveCardForReviewIndividualSector(session: RcdaTypedSession, sectorId: string): Message {
    const adaptiveCardBody: object[] = [
        {
            "type": "TextBlock",
            "size": "medium",
            "weight": "default",
            "text": `Please review **${Sectors.find(x => x.id == sectorId).name.en}**`,
            "horizontalAlignment": "left"
        }
    ];

    let facts: {title: any, value: string}[] = [];
    adaptiveCardBody.push({
        "type": "FactSet",
        "facts": facts,
        "separator": true
    });

    const sectorData = session.conversationData.mm.sectors.completedSectors.find(x => x.id === sectorId);

    let severityDescription = (severity: number) => SectorSeverityScale.find(x => x.value == severity).label.en;
    facts.push({
        title: "Severity",
        value: sectorData.severity ? `${sectorData.severity} - ${severityDescription(sectorData.severity)}` : "No Response"
    });

    let scaleDescription = (factorScore: number) => SectorFactorImpactScale.find(x => x.value == factorScore).label.en;
    sectorData.factors.forEach(factor => {
        facts.push({
            title: SectorFactors.find(x => x.id == factor.id).name.en,
            value: factor.factorScore ? `${factor.factorScore} - ${scaleDescription(factor.factorScore)}` : "No Response"
        });
    });
    
    let basicNeedsConcernDescription = (concern: number) => SectorBasicNeedsConcernScale.find(x => x.value == concern).label.en;
    facts.push({
        title: "Basic Needs",
        value: sectorData.basicNeedsConcern ? `${sectorData.basicNeedsConcern} - ${basicNeedsConcernDescription(sectorData.basicNeedsConcern)}` : "No Response"
    });

    const sectorReviewCard: Message = new Message(session).addAttachment({
        contentType: "application/vnd.microsoft.card.adaptive",
        content: {
            type: "AdaptiveCard",
            body: [...adaptiveCardBody],
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

    return sectorReviewCard;
}