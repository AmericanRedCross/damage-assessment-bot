import { Message } from "botbuilder";
import rcdaChatDialog from "@/chat/utils/rcdaChatDialog";
import { RcdaTypedSession } from "@/chat/utils/rcda-chat-types";
import { RcdaChatDialog } from "@/chat/utils/rcda-chat-types";
import RcdaPrompts from "@/chat/prompts/RcdaPrompts";
import * as askAffectedPeople from "@/chat/dialogs/myanmar/disaster-assessment/questions/askAffectedPeopleDialog";
import { askAffectedPeopleQuestions } from "@/chat/dialogs/myanmar/disaster-assessment/utils/askAffectedPeopleQuestions";

export const reviewAffectedPeopleDialog: RcdaChatDialog = rcdaChatDialog(
    "/reviewAffectedPeople",
    null,
    [
        ({ session }) => {
            RcdaPrompts.adaptiveCard(session, createAffectedPeopleReviewCard(session));
        },
        ({ session, result }) => {
            const userChoice:string = result.response.id;
            if (userChoice && userChoice.toLowerCase() === "edit") {
                session.beginDialog(askAffectedPeople.askAffectedPeopleDialog.id);
            } else {
                session.endDialog();
            }
        }
    ],
    {
        references: () => [askAffectedPeople.askAffectedPeopleDialog]
    });

function createAffectedPeopleReviewCard(session: RcdaTypedSession):Message {
    
    const adaptiveCardBody: Array<object> = [
        {
            "type": "TextBlock",
            "size": "medium",
            "weight": "default",
            "text": `Please review **People**`,
            "horizontalAlignment": "left"
        }];

    let isFirstValue = true;
    for (const [formVariableName,description] of askAffectedPeopleQuestions) {
        if (session.conversationData[formVariableName]) {
            adaptiveCardBody.push({
                "type": "TextBlock",
                "size": "medium",
                "weight": "default",
                "separator": isFirstValue,
                "text": `${description} - ${session.conversationData[formVariableName]}`,
                "horizontalAlignment": "left"
            });
            isFirstValue = false;
        }
    }

    const affectedPeopleReviewCard:Message = new Message(session).addAttachment({
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
                        "id": "Save People"
                    }
                }
            ]
        }
    });

    return affectedPeopleReviewCard;
}