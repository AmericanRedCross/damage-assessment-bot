import { Prompts, Session, ListStyle, TextFormat } from "botbuilder";

const disasterNameQuestions:Array<string> = ["Could you please tell me the name of the disaster?","What is the name of the disaster?"];

export const ask_iana_details:any = [
    function (session:Session):void {
        session.send("Hello! This is ARC bot ready to collect Global ENA Data");
        Prompts.text(session,disasterNameQuestions);
    },
    function (session:Session,results:any):void {
        session.conversationData.disasterName = results.response;
        session.conversationData.date = (new Date(Date.now())).toISOString();
        Prompts.text(session,"What is your complete name?");
    },
    function (session:Session,results:any):void {
        session.conversationData.enumerator = results.response;
        Prompts.text(session,"Please provide Geographical Area Name");
    },
    function (session:Session,results:any):void {
        session.conversationData.adminStack = results.response;
        Prompts.choice(session,"Setting?",["Urban","Rural","Semi-Urban"],{listStyle:ListStyle.button});
    },
    function (session:Session,results:any):void {
        session.conversationData.setting = results.response;
        session.endDialog();
    }
];