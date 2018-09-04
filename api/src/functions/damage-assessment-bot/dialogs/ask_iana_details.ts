import { Prompts, Session, ListStyle, TextFormat } from "botbuilder";

const disasterNameQuestions:Array<string> = ["Could you please tell me the name of the disaster?","What is the name of the disaster?"];

export const ask_iana_details:any = [
    function (session:Session):void {
        session.send("Hello! This is ARC bot ready to collect ENA Data");
        Prompts.text(session,disasterNameQuestions);
    },
    function (session:Session,results:any):void {
        console.log(typeof results);
        session.userData.DisasterName = results.response;
        session.userData.Date = Date.now();
        Prompts.text(session,"What is your complete name?");
    },
    function (session:Session,results:any):void {
        session.userData.Enumerator = results.response;
        Prompts.text(session,"Please provide Geographical Area Name");
    },
    function (session:Session,results:any):void {
        session.userData.AdminStack = results.response;
        Prompts.choice(session,"Setting?",["Urban","Rural","Semi-Urban"],{listStyle:ListStyle.button});
    },
    function (session:Session,results:any):void {
        session.userData.Setting = results.response;
        // prompts.choice(session,"Please choose color(s)",["Red","Green","Blue"],{listStyle:ListStyle.list})
        Prompts.text(session,"Please select the color - **Red**, **Blue**, **Green**",{textFormat:TextFormat.markdown});
    },
    function (session:Session,results:any):void {
        console.log(results.response.toString());
        let choices:Array<string> = results.response.toString().split(",");
        console.log(choices);
        session.userData.Choices = choices;
        Prompts.confirm(session,"Thank you for providing the data! Should I save it?",{listStyle:ListStyle.button});
    },
    function (session:Session,results:any):void {
        let choice:any = results.response;
        choice = choice.toString();
        console.log(typeof results.response);
        if ( choice.toLowerCase() === "yes") {
            session.endConversation("Thanks! Good Bye!");
        } else {
            console.log("Moving to original conversation...");
            session.replaceDialog("/");
        }
    }
];