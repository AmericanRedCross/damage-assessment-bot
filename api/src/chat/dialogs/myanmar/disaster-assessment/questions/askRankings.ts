import rcdaChatDialog from "@/chat/utils/rcdaChatDialog";
import { askTopAffectedGroupsDialog } from "@/chat/dialogs/myanmar/disaster-assessment/questions/askTopAffectedGroups";
import { askTopPrioritySectorsDialog } from "@/chat/dialogs/myanmar/disaster-assessment/questions/askTopPrioritySectors";
import { askTopVulnerableGroupsDialog } from "@/chat/dialogs/myanmar/disaster-assessment/questions/askTopVulnerableGroups";
import { askTopResponseModalitiesDialog } from "@/chat/dialogs/myanmar/disaster-assessment/questions/askTopResponseModalities";
import { reviewRankingsDialog } from "@/chat/dialogs/myanmar/disaster-assessment/review/reviewRankingsDialog";

export const askRankingsDialog = rcdaChatDialog(
    "/askRankings",
    null,
    [
        ({ session }) => {
            session.beginDialog(askTopAffectedGroupsDialog.id);
        },
        ({ session }) => {
            session.beginDialog(askTopPrioritySectorsDialog.id);
        },
        ({ session }) => {
            session.beginDialog(askTopVulnerableGroupsDialog.id);
        },
        ({ session }) => {
            session.beginDialog(askTopResponseModalitiesDialog.id);
        },
        ({ session }) => {
            session.beginDialog(reviewRankingsDialog.id)
        }
    ],
    {
        references: [
            askTopAffectedGroupsDialog,
            askTopPrioritySectorsDialog,
            askTopVulnerableGroupsDialog,
            askTopResponseModalitiesDialog,
            reviewRankingsDialog
        ]
    });