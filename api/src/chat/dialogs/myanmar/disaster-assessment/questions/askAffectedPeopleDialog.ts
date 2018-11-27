import { Message, Prompts } from "botbuilder";
import rcdaChatDialog from "@/chat/utils/rcdaChatDialog";
import { RcdaTypedSession } from "@/chat/utils/rcda-chat-types";
import RcdaPrompts from "@/chat/prompts/RcdaPrompts";
import { reviewAffectedPeopleDialog } from "@/chat/dialogs/myanmar/disaster-assessment/review/reviewAffectedPeopleDialog";
import RcdaChatLocalizer from "@/chat/localization/RcdaChatLocalizer";
import MyanmarConversationData, { MyanmarAffectedPeopleSectionInput } from "@/chat/models/MyanmarConversationData";

export const askAffectedPeopleDialog = rcdaChatDialog(
    "/askAffectedPeople",
    null,
    [
        ({ session, localizer }) => {
            RcdaPrompts.adaptiveCard(session, createAdaptiveCardForAffectedPeople(session.conversationData.mm, localizer));
        },
        ({ session, result }) => {
            // save selections
            session.conversationData.mm.people = result.response;
            // review
            session.beginDialog(reviewAffectedPeopleDialog.id);
        }
    ], {
        references: [ 
            reviewAffectedPeopleDialog
        ]
    });

function createAdaptiveCardForAffectedPeople(myanmarData: MyanmarConversationData, localizer: RcdaChatLocalizer) {
    const adaptiveCardBody:Array<object> = [];

    const addQuestion = (questionName: keyof MyanmarAffectedPeopleSectionInput, inputLabel: string) => {
        adaptiveCardBody.push(
            {
                "type": "TextBlock",
                "size": "medium",
                "weight": "default",
                "text": inputLabel,
                "horizontalAlignment": "left"
            },
            {
                "type": "Input.Number",
                "placeholder": "Quantity",
                "min": 0,
                // Check if there is any maximum value for these type of questions. Just confirm. "max": 5,
                "value": myanmarData.people[questionName],
                "id": questionName
            }
        );
    }
    
    addQuestion("numberOfPeopleBeforeDisaster", localizer.mm.inputLabelNumberOfPeopleBeforeDisaster);
    addQuestion("numberOfPeopleLeftArea", localizer.mm.inputLabelNumberOfPeopleLeftArea);
    addQuestion("numberOfPeopleReturned", localizer.mm.inputLabelNumberOfPeopleReturned);
    addQuestion("numberOfPeopleLivingCurrently", localizer.mm.inputLabelNumberOfPeopleLivingCurrently);
    addQuestion("numberOfPeopleAffected", localizer.mm.inputLabelNumberOfPeopleAffected);
    addQuestion("numberOfPeopleDisplaced", localizer.mm.inputLabelNumberOfPeopleDisplaced);
    addQuestion("numberOfPeopleNotDisplaced", localizer.mm.inputLabelNumberOfPeopleNotDisplaced);
    addQuestion("numberOfCasualties", localizer.mm.inputLabelNumberOfCasualties);

    return {
        body: [...adaptiveCardBody],
        actions: [
            {
                "type": "Action.Submit",
                "title": "Save"
            }
        ]
    };
}