import { ChatConnector, UniversalBot, Prompts, Session, LuisRecognizer, TextFormat, ListStyle, Prompt } from "botbuilder";
import {MongoClient, MongoError} from "mongodb";
import {MongoBotStorage} from "botbuilder-storage";
import * as gena from "./dialogs/ask_iana_details";
import { nextTick } from "async";

const connector: ChatConnector = new ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

const listener: any = connector.listen();

const rcdaBot: UniversalBot = new UniversalBot(connector,function (session:Session):any {
    session.send("Please types something!");
});
const mongoDbHostUri:string = process.env.MongoDbHostUri;
const mongoDbUsername:string = process.env.MongoDbUsername;
const mongodbPassword:string = process.env.MongoDbPassword;

const MongoDbTtlInSeconds:number = parseInt(process.env.MongoDbTtlInSeconds,10);

MongoClient.connect(mongoDbHostUri,
    {useNewUrlParser: true,auth:{user:mongoDbUsername,password:mongodbPassword}},
    function (err:MongoError,client:MongoClient): any {
        if (err) {
           throw err;
        }
        const connectionSettings: any = {
             collection: process.env.MongoDbBotStateCollectionName,
             ttl: {
                 userData: MongoDbTtlInSeconds,
                 conversationData: MongoDbTtlInSeconds,
                 privateConversationData: MongoDbTtlInSeconds
             }
   };
   const db:any = client.db(process.env.MongoDbName);
   const botStorageAdapter:MongoBotStorage = new MongoBotStorage(db,connectionSettings);

   rcdaBot.set("storage",botStorageAdapter);
});

const recognizer:any = new LuisRecognizer(process.env.LuisConnectionString);
rcdaBot.recognizer(recognizer);

console.log(recognizer);
rcdaBot.dialog("GreetingDialog",[
    function (session:Session):void {
        // session.send("You have reached the Greeting intent. You said %s",session.message.text);
        // session.sendTyping();
        // session.endDialog("Ending this conversation :'(");
        session.send("Testing feature...");
        Prompts.confirm(session,"Select Yes,No",{listStyle:ListStyle.button});
    },
    function (session:Session,results:any):void {
        console.log(results.response);
        session.send(`You typed in -- ${results.response.toString()}`);
    }
]).triggerAction({
    matches: "HelloWorld"
});

// rcdaBot.dialog("/",function (session:Session):any {
//    session.sendTyping();
//    session.send("Hello! Your name is %s?",session.userData.Name);
//    session.sendTyping();
//    session.endConversation("Thank you for passing the data!");
// });

// rcdaBot.use(Middleware.firstRun({ version: 1.0, dialogId: "*:/name" }));
let concernSectors:Array<string> = new Array("Health","Food","Wash","Shelter/NFI","Protection","Education","Livelihood","Other");
let genaFormData:Map<string,string> = new Map();
let sectorConcern:Map<string,boolean> = new Map();

rcdaBot.dialog("/ask_sector_concern",[
    function (session:Session,args:any):void {
        // session.dialogData.index = args ? args.index : 0;
        // session.dialogData.form = args ? args.sectorConcern : {};
        if (!args) {
            let sectorsConcern:object = {};
            // for (let i:number = 0; i < concernSectors.length; i++) {
            //     sectorsConcern[concernSectors[i]] = "no";
            // }
            console.log(sectorsConcern);
            session.dialogData.form = sectorsConcern;
            session.dialogData.index = 0;
        } else {
            session.dialogData.form = args.form;
            session.dialogData.index = args.index;
        }
        Prompts.confirm(session,`Do you have a concern in sector **${concernSectors[session.dialogData.index]}** ?`,
        {listStyle: ListStyle.button});
    },
    function (session:Session,results:any):void {
        const sector:string = concernSectors[session.dialogData.index++];
        const isConcernInSector:string = results.response;
        session.dialogData.form[sector] = isConcernInSector;

        // check for end of form
        if (session.dialogData.index >= concernSectors.length) {
            // return completed form
            session.endDialogWithResult({ response: session.dialogData.form });
        } else {
            // next field
            session.replaceDialog("/ask_sector_concern", session.dialogData);
        }
    }
]);

rcdaBot.dialog("/sector_severity",[
    function (session:Session,args:any,next:any):void {
        if (!args) {
            let sectorsConcernSeverity:object = {};
            session.dialogData.form = {};
            session.dialogData.index = 0;
        } else {
            session.dialogData.form = args.form;
            session.dialogData.index = args.index;
        }
        if (session.conversationData.sector_concern[concernSectors[session.dialogData.index]]) {
            Prompts.number(session,`What is the severity of concern in **${concernSectors[session.dialogData.index]}** sector?`,
            {textFormat:TextFormat.markdown});
        } else {
            next();
        }
    },
    function (session:Session,results:any):void {
        const sector:string = concernSectors[session.dialogData.index++];
        const sectorConcernSeverity:number = results.response;
        if (sectorConcernSeverity === undefined) {
            session.dialogData.form[sector] = 0;
        } else {
            session.dialogData.form[sector] = sectorConcernSeverity;
        }
        // console.log(session.dialogData);
        // check for end of form
        if (session.dialogData.index >= concernSectors.length) {
            // return completed form
            session.endDialogWithResult({ response: session.dialogData.form });
        } else {
            // next field
            session.replaceDialog("/sector_severity", session.dialogData);
        }
    }
]);

rcdaBot.dialog("/sector_problem_factors",[
    function (session:Session,args:any,next:any):void {
        // console.log(session.conversationData);
        let sectorsConcernFactors:object = {};
        if (!args) {
            session.dialogData.form = {};
            session.dialogData.index = 0;
            // console.log(concernSectors);
            console.log(session.dialogData);
        } else {
            session.dialogData.form = args.form;
            session.dialogData.index = args.index;
        }
        next();
    },
    function (session:Session,results:any,next:any):void {
        if (session.conversationData.sector_concern[concernSectors[session.dialogData.index]]) {
            Prompts.number(session,`What is the factor scoring in Access in **${concernSectors[session.dialogData.index]}** sector?`,
            {textFormat:TextFormat.markdown});
        } else {
            next();
        }
    },
    function (session:Session,results:any,next:any):void {
        const sector:string = concernSectors[session.dialogData.index];
        let sectorConcernFactorScore:number = results.response;
        session.dialogData.form[sector] = {};
        if (sectorConcernFactorScore === undefined) {
            sectorConcernFactorScore = 0;
        }
        session.dialogData.form[sector].Access = sectorConcernFactorScore;
        console.log(session.dialogData.form);
        if (session.conversationData.sector_concern[concernSectors[session.dialogData.index]]) {
            Prompts.number(session,`What is the factor scoring in Availability in **${concernSectors[session.dialogData.index]}** sector?`,
            {textFormat:TextFormat.markdown});
        } else {
            next();
        }
    },
    function (session:Session,results:any,next:any):void {
        const sector:string = concernSectors[session.dialogData.index];
        let sectorConcernFactorScore:number = results.response;
        if (sectorConcernFactorScore === undefined) {
            sectorConcernFactorScore = 0;
        }
        session.dialogData.form[sector].Availability = sectorConcernFactorScore;
        if (session.conversationData.sector_concern[concernSectors[session.dialogData.index]]) {
            Prompts.number(session,`What is the factor scoring in Quality in **${concernSectors[session.dialogData.index]}** sector?`,
            {textFormat:TextFormat.markdown});
        } else {
            next();
        }
    },
    function (session:Session,results:any,next:any):void {
        const sector:string = concernSectors[session.dialogData.index];
        let sectorConcernFactorScore:number = results.response;
        if (sectorConcernFactorScore === undefined) {
            sectorConcernFactorScore = 0;
        }
        session.dialogData.form[sector].Quality = sectorConcernFactorScore;
        if (session.conversationData.sector_concern[concernSectors[session.dialogData.index]]) {
            Prompts.number(session,`What is the factor scoring in Use in **${concernSectors[session.dialogData.index]}** sector?`,
            {textFormat:TextFormat.markdown});
        } else {
            next();
        }
    },
    function (session:Session,results:any,next:any):void {
        const sector:string = concernSectors[session.dialogData.index++];
        let sectorConcernFactorScore:number = results.response;
        if (sectorConcernFactorScore === undefined) {
            sectorConcernFactorScore = 0;
        }
        session.dialogData.form[sector].Use = sectorConcernFactorScore;
        if (session.dialogData.index >= concernSectors.length) {
            // return completed form
            session.endDialogWithResult({ response: session.dialogData.form });
        } else {
            // next field
            session.replaceDialog("/sector_problem_factors", session.dialogData);
        }
    }
]);

rcdaBot.dialog("/name",[
    function (session:Session): any {
        session.beginDialog("/ask_sector_concern");
        // session.beginDialog("/sector_severity");
    },
    function (session:Session,results: any):any {
        // implement session resumption functionality
        // session.conversationData.sector = session.conversationData.sector ? session.conversationData.sector : {};
        session.conversationData.sector_concern = results.response;
       // console.log(session.conversationData);
        session.beginDialog("/sector_severity");
    },
    function (session:Session,results:any):void {
        console.log(results.response);
        session.conversationData.sector_severity = results.response;
        // console.log(session.conversationData);
        session.beginDialog("/sector_problem_factors");
    },
    function (session:Session,results:any):void {
        session.conversationData.sector_problem_factors = results.response;
        console.log(session.conversationData);
    }
]
).triggerAction({
    matches: "Greeting"
});


rcdaBot.dialog("/ask_iana",gena.ask_iana_details);

rcdaBot.dialog("/ask_people_affected",[
    function (session:Session):void {
        Prompts.number(session,"What is the number of people before disaster?",{integerOnly:true});
    },
    function (session:Session,results:any):void {
        session.conversationData.numberOfPeopleBeforeDisaster = results.response;
        genaFormData.set("numberOfPeopleBeforeDisaster",results.response);
        Prompts.number(session,"What is the number of people who have left the area?",{integerOnly:true});
    },
    function (session:Session,results:any):void {
        session.conversationData.numberOfPeopleLeftArea = results.response;
        genaFormData.set("numberOfPeopleLeftArea",results.response);
        Prompts.number(session,"What is the number of people who have returned?",{integerOnly:true});
    },
    function (session:Session,results:any):void {
        session.conversationData.numberOfPeopleReturned = results.response;
        genaFormData.set("numberOfPeopleReturned",results.response);
        Prompts.number(session,"What is the number of people currently living in the area?",{integerOnly:true});
    },
    function (session:Session,results:any):any {
        session.conversationData.numberOfPeopleLivingCurrently = results.response;
        genaFormData.set("numberOfPeopleLivingCurrently",results.response);
        Prompts.number(session,"What is the total number (SUM) of people affected?",{integerOnly:true});
    },
    function (session:Session,results:any):void {
        session.conversationData.totalNumberOfPeopleAffected = results.response;
        genaFormData.set("totalNumberOfPeopleAffected",results.response);
        Prompts.number(session,"What is the number of people who have been displaced?",{integerOnly:true});
    },
    function (session:Session,results:any):void {
        session.conversationData.numberOfPeopleDisplaced = results.response;
        genaFormData.set("numberOfPeopleDisplaced",results.response);
        Prompts.number(session,"What is the number of people affected who haven't displaced?",{integerOnly:true});
    },
    function (session:Session,results:any):void {
        session.conversationData.numberOfPeopleNotDisplaced = results.response;
        genaFormData.set("numberOfPeopleNotDisplaced",results.response);
        Prompts.number(session,"What is the number of casualties?",{integerOnly:true});
    },
    function (session:Session,results:any):void {
        session.conversationData.numberOfCasualties = results.response;
        genaFormData.set("numberOfCasualties",results.response);
        Prompts.confirm(session,("Does the below information look correct?"+JSON.stringify(genaFormData)));
    },
    function (session:Session,results:any):void {
        const confirmation:string = results.response.toString();
        if (confirmation.toLowerCase() === "yes") {
            session.send("Thank you for confirmation!");
            session.endDialog();
        } else {
            session.send("Resetting the conversation...");
            session.reset("/ask_people_affected");
        }
    }
]);

rcdaBot.dialog("/concern_in_sectors",[
    function (session:Session):void {
        Prompts.confirm(session,
            `Do you have a situation of concern in the one or more of the following sectors? -
        1. Health
        2. Food
        3. Wash
        4. Shelter/NFI
        5. Protection
        6. Education
        7. Livelihood
        8. Other
        `,{textFormat:TextFormat.markdown});
    },
    function (session:Session,results:any):void {
        const confirmation:string = results.response.toString();
        if (confirmation.toLowerCase() === "yes") {
            session.beginDialog("/ask_sector_concerns");
        } else {
            sectorConcern.set("health",false);
            sectorConcern.set("food",false);
            sectorConcern.set("wash",false);
            sectorConcern.set("shelter",false);
            sectorConcern.set("protection",false);
            sectorConcern.set("education",false);
            sectorConcern.set("livelihood",false);
            sectorConcern.set("other",false);
            session.conversationData.sectorConcern = sectorConcern;
        }
    }
]);

rcdaBot.dialog("/ask_sector_concerns",[
    function (session:Session):void {
        Prompts.confirm(session,"Do you have a concern in **HEALTH** sector?",{textFormat:TextFormat.markdown});
    },
    function (session:Session,results:any):void {
        const confirmation:string = results.response.toString();
        if (confirmation.toLowerCase() === "yes") {
            sectorConcern.set("health",true);
        } else {
            sectorConcern.set("health",false);
        }
        Prompts.confirm(session,"Do you have a concern in **FOOD** sector?",{textFormat:TextFormat.markdown});
    },
    function (session:Session,results:any):void {
        const confirmation:string = results.response.toString();
        if (confirmation.toLowerCase() === "yes") {
            sectorConcern.set("food",true);
        } else {
            sectorConcern.set("food",false);
        }
        Prompts.confirm(session,"Do you have a concern in **WASH** sector?",{textFormat:TextFormat.markdown});
    },
    function (session:Session,results:any):void {
        const confirmation:string = results.response.toString();
        if (confirmation.toLowerCase() === "yes") {
            sectorConcern.set("wash",true);
        } else {
            sectorConcern.set("wash",false);
        }
        Prompts.confirm(session,"Do you have a concern in **SHELTER/NFI** sector?",{textFormat:TextFormat.markdown});
    },
    function (session:Session,results:any):void {
        const confirmation:string = results.response.toString();
        if (confirmation.toLowerCase() === "yes") {
            sectorConcern.set("shelter",true);
        } else {
            sectorConcern.set("shelter",false);
        }
        Prompts.confirm(session,"Do you have a concern in **PROTECTION** sector?",{textFormat:TextFormat.markdown});
    },
    function (session:Session,results:any):void {
        const confirmation:string = results.response.toString();
        if (confirmation.toLowerCase() === "yes") {
            sectorConcern.set("protection",true);
        } else {
            sectorConcern.set("protection",false);
        }
        Prompts.confirm(session,"Do you have a concern in **EDUCATION** sector?",{textFormat:TextFormat.markdown});
    },
    function (session:Session,results:any):void {
        const confirmation:string = results.response.toString();
        if (confirmation.toLowerCase() === "yes") {
            sectorConcern.set("education",true);
        } else {
            sectorConcern.set("education",false);
        }
        Prompts.confirm(session,"Do you have a concern in **LIVELIHOOD** sector?",{textFormat:TextFormat.markdown});
    },
    function (session:Session,results:any):void {
        const confirmation:string = results.response.toString();
        if (confirmation.toLowerCase() === "yes") {
            sectorConcern.set("livelihood",true);
        } else {
            sectorConcern.set("livelihood",false);
        }
        Prompts.confirm(session,"Do you have a concern in **OTHER** sector ?",{textFormat:TextFormat.markdown});
    },
    function (session:Session,results:any):void {
        const confirmation:string = results.response.toString();
        if (confirmation.toLowerCase() === "yes") {
            sectorConcern.set("other",true);
        } else {
            sectorConcern.set("other",false);
        }
        for (const key in sectorConcern.keys()) {
            if (sectorConcern.get(key)) {
                session.beginDialog("/ask_sector_concerns_score");
                session.beginDialog("/ask_sector_concerns_factors",{sectorConcern:sectorConcern});
                break;
            }
        }
    }
]);

rcdaBot.dialog("/ask_sector_concerns_score",[
    function (session:Session,next:any):void {
        session.send("On a rating of 1 (Minor Problem) - 5 (Life Threatening Problem), please enter values");
        if (sectorConcern[concernSectors[0]]) {
            Prompts.number(session,`What is the severity of concern in  **${concernSectors[0]}** sector?`,{integerOnly:true});
        } else {
            next();
        }
    },
    function (session:Session,results:any,next:any):void {
        session.send("On a rating of 1 (Minor Problem) - 5 (Life Threatening Problem), please enter values");
        if (sectorConcern[concernSectors[1]]) {
            Prompts.number(session,`What is the severity of concern in  **${concernSectors[1]}** sector?`,{integerOnly:true});
        } else {
            next();
        }
    },
    function (session:Session,sectorConcern:any,next:any):void {
        session.send("On a rating of 1 (Minor Problem) - 5 (Life Threatening Problem), please enter values");
        if (sectorConcern[concernSectors[2]]) {
            Prompts.number(session,`What is the severity of concern in  **${concernSectors[2]}** sector?`,{integerOnly:true});
        } else {
            next();
        }
    },
    function (session:Session,sectorConcern:any,next:any):void {
        session.send("On a rating of 1 (Minor Problem) - 5 (Life Threatening Problem), please enter values");
        if (sectorConcern[concernSectors[3]]) {
            Prompts.number(session,`What is the severity of concern in  **${concernSectors[3]}** sector?`,{integerOnly:true});
        } else {
            next();
        }
    },
    function (session:Session,sectorConcern:any,next:any):void {
        session.send("On a rating of 1 (Minor Problem) - 5 (Life Threatening Problem), please enter values");
        if (sectorConcern[concernSectors[4]]) {
            Prompts.number(session,`What is the severity of concern in  **${concernSectors[4]}** sector?`,{integerOnly:true});
        } else {
            next();
        }
    },
    function (session:Session,sectorConcern:any,next:any):void {
        session.send("On a rating of 1 (Minor Problem) - 5 (Life Threatening Problem), please enter values");
        if (sectorConcern[concernSectors[5]]) {
            Prompts.number(session,`What is the severity of concern in  **${concernSectors[5]}** sector?`,{integerOnly:true});
        } else {
            next();
        }
    },
    function (session:Session,sectorConcern:any,next:any):void {
        session.send("On a rating of 1 (Minor Problem) - 5 (Life Threatening Problem), please enter values");
        if (sectorConcern[concernSectors[6]]) {
            Prompts.number(session,`What is the severity of concern in  **${concernSectors[6]}** sector?`,{integerOnly:true});
        } else {
            next();
        }
    },
    function (session:Session,sectorConcern:any,next:any):void {
        session.send("On a rating of 1 (Minor Problem) - 5 (Life Threatening Problem), please enter values");
        if (sectorConcern[concernSectors[7]]) {
            Prompts.number(session,`What is the severity of concern in  **${concernSectors[7]}** sector?`,{integerOnly:true});
        } else {
            next();
        }
    },
    function (session:Session,sectorConcern:any,next:any):void {
        session.send("On a rating of 1 (Minor Problem) - 5 (Life Threatening Problem), please enter values");
        if (sectorConcern[concernSectors[8]]) {
            Prompts.number(session,`What is the severity of concern in  **${concernSectors[8]}** sector?`,{integerOnly:true});
        } else {
            next();
        }
    }
]);



// environment glue
module.exports = function (context: any, req: any): any {
    context.log("Passing body", req.body);
    listener(req, context.res);
};