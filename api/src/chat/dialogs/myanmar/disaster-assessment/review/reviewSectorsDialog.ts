import { Message } from "botbuilder";
import { RcdaTypedSession } from "@/chat/utils/rcda-chat-types";
import rcdaChatDialog, { rcdaChatDialogStateful } from "@/chat/utils/rcdaChatDialog";
import { RcdaChatDialog, RcdaChatStep } from "@/chat/utils/rcda-chat-types";
import RcdaPrompts from "@/chat/prompts/RcdaPrompts";
import * as askSectors from "@/chat/dialogs/myanmar/disaster-assessment/questions/askSectors";
import RcdaChatLocalizer from "@/chat/localization/RcdaChatLocalizer";
import { MyanmarSectors } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarSectors";
import { getKeys } from "@common/utils/objectHelpers";

export const reviewSectorsDialog: RcdaChatDialog = rcdaChatDialog(
    "/reviewSectors",
    null,
    [
        ({ session }) => {
            session.beginDialog(reviewCompletedSectors.id);
        },
        ({ session, localizer }) => {
            RcdaPrompts.adaptiveCard(session, createAdaptiveCardForReviewSelectedSectors(session, localizer));
        },
        ({ session, result }) => {
            const userChoice: string = result.response.id;
            if (userChoice && userChoice.toLowerCase() === "edit") {
                session.replaceDialog(askSectors.askSectorsDialog.id);
            } else {
                session.endDialog();
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
    () => ({
        currentSectorIndex: 0
    }),
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
    ({ result }) => ({
        sector: result as MyanmarSectors
    }),
    [
        ({ session, localizer }) => {
            RcdaPrompts.adaptiveCard(session, createAdaptiveCardForReviewIndividualSector(session, localizer, session.dialogData.sector));
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

function createAdaptiveCardForReviewSelectedSectors(session: RcdaTypedSession, localizer: RcdaChatLocalizer) {
    
    let selectedSectorIds = session.conversationData.mm.sectors.selectedSectorIds;
    let unselectedSectorIds = getKeys(localizer.mm.sectors).filter(x => !selectedSectorIds.includes(x));

    const adaptiveCardBody: object[] = [];

    adaptiveCardBody.push({
        "type": "TextBlock",
        "size": "medium",
        "weight": "default",
        "text": localizer.mm.reviewSectorListHeader,
        "wrap": true,
        "horizontalAlignment": "left"
    });

    // List selected sectors
    adaptiveCardBody.push({
        "type": "TextBlock",
        "size": "medium",
        "weight": "default",
        "text": localizer.mm.reviewSectorsReported,
        "wrap": true,
        "separator": true,
        "spacing": "Medium",
        "horizontalAlignment": "left"
    });
    for (let sectorId of selectedSectorIds) {
        adaptiveCardBody.push({
            "type": "TextBlock",
            "size": "medium",
            "weight": "default",
            "text": `- ${localizer.mm.sectors[sectorId]}`,
            "horizontalAlignment": "left"
        });
    }

    // List unselected sectors
    adaptiveCardBody.push({
        "type": "TextBlock",
        "size": "medium",
        "weight": "default",
        "text": localizer.mm.reviewSectorsNotReported,
        "wrap": true,
        "horizontalAlignment": "left"
    });
    for (let sectorId of unselectedSectorIds) {
        adaptiveCardBody.push({
            "type": "TextBlock",
            "size": "medium",
            "weight": "default",
            "text": `- ${localizer.mm.sectors[sectorId]}`,
            "horizontalAlignment": "left"
        });
    }
    
    return {
        body: [...adaptiveCardBody],
        actions: [
            {
                "type": "Action.Submit",
                "title": localizer.mm.editReviewCard,
                "data": {
                    "id": "Edit"
                }
            },
            {
                "type": "Action.Submit",
                "title": localizer.mm.acceptReviewCard,
                "data": {
                    "id": "Accept"
                }
            }
        ]
    };
}

function createAdaptiveCardForReviewIndividualSector(session: RcdaTypedSession, localizer: RcdaChatLocalizer, sectorId: MyanmarSectors) {
    const adaptiveCardBody: object[] = [
        {
            "type": "TextBlock",
            "size": "medium",
            "weight": "default",
            "text": localizer.mm.reviewSectionHeader(localizer.mm.sectors[sectorId]),
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

    facts.push({
        title: localizer.mm.sectorSeverityQuestionHeader,
        value: sectorData.severity ? `${sectorData.severity} - ${localizer.mm.sectorSeverityScale[sectorData.severity]}` : localizer.mm.reviewSectionNoResponseValue
    });

    sectorData.factors.forEach(factor => {
        facts.push({
            title: localizer.mm.sectorFactors[factor.id],
            value: factor.factorScore ? `${factor.factorScore} - ${localizer.mm.sectorFactorImpactScale[factor.factorScore]}` : localizer.mm.reviewSectionNoResponseValue
        });
    });
    
    facts.push({
        title: localizer.mm.sectorBasicNeedsQuestionHeader,
        value: sectorData.basicNeedsConcern ? `${sectorData.basicNeedsConcern} - ${localizer.mm.sectorBasicNeedsConcernScale[sectorData.basicNeedsConcern]}` : localizer.mm.reviewSectionNoResponseValue
    });

    return {
        body: adaptiveCardBody,
        actions: [
            {
                "type": "Action.Submit",
                "title": localizer.mm.editReviewCard,
                "data": {
                    "id": "Edit"
                }
            },
            {
                "type": "Action.Submit",
                "title": localizer.mm.acceptReviewCard,
                "data": {
                    "id": "Accept"
                }
            }
        ]
    };
}