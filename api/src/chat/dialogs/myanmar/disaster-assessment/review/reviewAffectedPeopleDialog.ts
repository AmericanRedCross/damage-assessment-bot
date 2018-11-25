import rcdaChatDialog from "@/chat/utils/rcdaChatDialog";
import { RcdaTypedSession } from "@/chat/utils/rcda-chat-types";
import { RcdaChatDialog } from "@/chat/utils/rcda-chat-types";
import RcdaPrompts from "@/chat/prompts/RcdaPrompts";
import * as askAffectedPeople from "@/chat/dialogs/myanmar/disaster-assessment/questions/askAffectedPeopleDialog";
import RcdaChatLocalizer from "@/chat/localization/RcdaChatLocalizer";

export const reviewAffectedPeopleDialog: RcdaChatDialog = rcdaChatDialog(
    "/reviewAffectedPeople",
    null,
    [
        ({ session, localizer }) => {
            RcdaPrompts.adaptiveCard(session, createAffectedPeopleReviewCard(session, localizer));
        },
        ({ session, result }) => {
            if (result.response.action === editAction) {
                session.beginDialog(askAffectedPeople.askAffectedPeopleDialog.id);
            } else {
                session.endDialog();
            }
        }
    ],
    {
        references: () => [askAffectedPeople.askAffectedPeopleDialog]
    });

const editAction = "edit";
const saveAction = "save";

function createAffectedPeopleReviewCard(session: RcdaTypedSession, localizer: RcdaChatLocalizer) {
    
    const adaptiveCardBody: Array<object> = [
        {
            "type": "TextBlock",
            "size": "medium",
            "weight": "default",
            "text": localizer.mm.reviewSectionHeader(localizer.mm.reportSectionNamePeople),
            "horizontalAlignment": "left"
        }];

    function addQuestionReview(value: any, label: string, addSeparator: boolean = false) {
        if (value || value === 0) {
            adaptiveCardBody.push({
                "type": "TextBlock",
                "size": "medium",
                "weight": "default",
                "separator": addSeparator,
                "text": `${label} - ${value}`,
                "horizontalAlignment": "left"
            });
        }
    }

    let peopleData = session.conversationData.mm.people;
    addQuestionReview(peopleData.numberOfPeopleBeforeDisaster, localizer.mm.inputLabelNumberOfPeopleBeforeDisaster, true);
    addQuestionReview(peopleData.numberOfPeopleLeftArea, localizer.mm.inputLabelNumberOfPeopleLeftArea);
    addQuestionReview(peopleData.numberOfPeopleReturned, localizer.mm.inputLabelNumberOfPeopleReturned);
    addQuestionReview(peopleData.numberOfPeopleLivingCurrently, localizer.mm.inputLabelNumberOfPeopleLivingCurrently);
    addQuestionReview(peopleData.numberOfPeopleAffected, localizer.mm.inputLabelNumberOfPeopleAffected);
    addQuestionReview(peopleData.numberOfPeopleDisplaced, localizer.mm.inputLabelNumberOfPeopleDisplaced);
    addQuestionReview(peopleData.numberOfPeopleNotDisplaced, localizer.mm.inputLabelNumberOfPeopleNotDisplaced);
    addQuestionReview(peopleData.numberOfCasualties, localizer.mm.inputLabelNumberOfCasualties);

    return {
        body: [...adaptiveCardBody],
        actions: [
            {
                "type": "Action.Submit",
                "title": "Edit",
                "data": {
                    "action": editAction
                }
            },
            {
                "type": "Action.Submit",
                "title": "Accept",
                "data": {
                    "action": saveAction
                }
            }
        ]
    };
}