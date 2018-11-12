import { Message } from "botbuilder";
import rcdaChatDialog from "@/chat/utils/rcdaChatDialog";
import { RcdaTypedSession } from "@/chat/utils/rcda-chat-types";
import RcdaPrompts from "@/chat/prompts/RcdaPrompts";
import { reviewAffectedPeopleDialog } from "@/chat/dialogs/myanmar/disaster-assessment/review/reviewAffectedPeopleDialog";
import { askAffectedPeopleQuestions } from "@/chat/dialogs/myanmar/disaster-assessment/utils/askAffectedPeopleQuestions";

export const askAffectedPeopleDialog = rcdaChatDialog(
    "/askAffectedPeople",
    null,
    [
        ({ session }) => {
            RcdaPrompts.adaptiveCard(session, createAdaptiveCardForAffectedPeople(session));
        },
        ({ session, result }) => {
            // save selections
            const affectedPeople: object = result.response;
            for (const peopleAffected of askAffectedPeopleQuestions.keys()) {
                session.conversationData[peopleAffected] = affectedPeople[peopleAffected];
            }
            // review
            session.beginDialog(reviewAffectedPeopleDialog.id);
        }
    ], {
        references: [ 
            reviewAffectedPeopleDialog
        ]
    });

function createAdaptiveCardForAffectedPeople(session: RcdaTypedSession): Message {
    const adaptiveCardBody:Array<object> = [];

    for (const [formVariableName,question] of askAffectedPeopleQuestions) {
        adaptiveCardBody.push(
            {
                "type": "TextBlock",
                "size": "medium",
                "weight": "default",
                "text": question,
                "horizontalAlignment": "left"
            },
            {
                "type": "Input.Number",
                "placeholder": "Quantity",
                "min": 0,
                // Check if there is any maximum value for these type of questions. Just confirm. "max": 5,
                "value": null,
                "id": formVariableName
            }
        );
    }

    const affectedPeopleAdaptiveCard:Message = new Message(session).addAttachment({
        contentType: "application/vnd.microsoft.card.adaptive",
        content: {
            type: "AdaptiveCard",
            body: [...adaptiveCardBody],
            actions: [
                {
                    "type": "Action.Submit",
                    "title": "Save"// ,
                    // "data": {
                    //     "id": "1234567890" // TODO Discuss with Max if these hidden fields could be utilized for something like authentication. Link to schema - https://adaptivecards.io/schemas/adaptive-card.json
                    // }
                }
            ]
        }
    });

    return affectedPeopleAdaptiveCard;
}