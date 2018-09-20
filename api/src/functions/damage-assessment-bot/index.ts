import { ChatConnector, UniversalBot, Prompts, Session, LuisRecognizer, TextFormat, ListStyle } from "botbuilder";
import {MongoClient, MongoError, Db} from "mongodb";
import {MongoBotStorage} from "botbuilder-storage";
import * as gena from "./dialogs/ask_iana_details";
import * as jsBeautify from "js-beautify";
import * as applicationInsights from "applicationinsights";

const connector: ChatConnector = new ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

const listener: any = connector.listen();

let rcdaDataStorageDb:Db = null;
const rcdaDataStorageCollectionName:string = process.env.MongoDbArcDataCollectionName;
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
   const db:Db = client.db(process.env.MongoDbName);
   rcdaDataStorageDb = db;
   const botStorageAdapter:MongoBotStorage = new MongoBotStorage(db,connectionSettings);

   rcdaBot.set("storage",botStorageAdapter);
});

const recognizer:LuisRecognizer = new LuisRecognizer(process.env.LuisConnectionString);
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
            session.dialogData.form = {};
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
            session.dialogData.form = {};
            session.dialogData.index = 0;
        } else {
            session.dialogData.form = args.form;
            session.dialogData.index = args.index;
        }
        if (session.conversationData.sectorConcern[concernSectors[session.dialogData.index]]) {
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
        if (session.conversationData.sectorConcern[concernSectors[session.dialogData.index]]) {
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
        if (session.conversationData.sectorConcern[concernSectors[session.dialogData.index]]) {
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
        if (session.conversationData.sectorConcern[concernSectors[session.dialogData.index]]) {
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
        if (session.conversationData.sectorConcern[concernSectors[session.dialogData.index]]) {
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

rcdaBot.dialog("/sector_future_concerns",[
    function (session:Session,args:any,next:any):void {
        if (!args) {
            session.dialogData.form = {};
            session.dialogData.index = 0;
        } else {
            session.dialogData.form = args.form;
            session.dialogData.index = args.index;
        }
        if (session.conversationData.sectorConcern[concernSectors[session.dialogData.index]]) {
            Prompts.number(session,`Do you have a future concern in **${concernSectors[session.dialogData.index]}** sector?`,
            {textFormat:TextFormat.markdown});
        } else {
            next();
        }
    },
    function (session:Session,results:any,next:any):void {
        const sector:string = concernSectors[session.dialogData.index++];
        let sectorFutureConcernScore:number = results.response;
        if (sectorFutureConcernScore === undefined) {
            sectorFutureConcernScore = 0;
        }
        session.dialogData.form[sector] = sectorFutureConcernScore;

        if (session.dialogData.index >= concernSectors.length) {
            // return completed form
            session.endDialogWithResult({ response: session.dialogData.form });
        } else {
            // next field
            session.replaceDialog("/sector_future_concerns", session.dialogData);
        }
    }
]);

rcdaBot.dialog("/groups_requiring_immediate_assistance",[
    function (session:Session,args:any,next:any):void {
        Prompts.text(session,"Who are the top three affected groups (comma-separated) that require immediate assistance in this area?");
    },
    function (session:Session,results:any,next:any):void {
        let groupsAffected:string = results.response;
        const groupsAffectedArray:Array<string> = groupsAffected.split(",");
        // look into recognizing entities...
        // luisRecognizer.recognize(groupsAffected,process.env.LuisConnectionString,
        //     function (error:Error,intents?: IIntent[],entities?: IEntity[]):void {
        //     console.log(entities);
        // });
        session.endDialogWithResult({response : groupsAffectedArray});
    }
]);

rcdaBot.dialog("/immediate_priority_sectors",[
    function (session:Session,args:any,next:any):void {
        Prompts.text(session,"What are the top three priority sectors (comma separated) requiring immediate assistance in this area?");
    },
    function (session:Session,results:any,next:any):void {
        let immediatePrioritySectors:string = results.response;
        const immediatePrioritySectorsArray:Array<string> = immediatePrioritySectors.split(",");
        // look into recognizing entities...
        // luisRecognizer.recognize(groupsAffected,process.env.LuisConnectionString,
        //     function (error:Error,intents?: IIntent[],entities?: IEntity[]):void {
        //     console.log(entities);
        // });
        session.endDialogWithResult({response : immediatePrioritySectorsArray});
    }
]);

rcdaBot.dialog("/immediate_vulnerable_groups",[
    function (session:Session,args:any,next:any):void {
        Prompts.text(session,"What are the top three vulnerable groups (comma separated) requiring immediate assistance in this area?");
    },
    function (session:Session,results:any,next:any):void {
        let vulnerableGroups:string = results.response;
        const vulnerableGroupsArray:Array<string> = vulnerableGroups.split(",");
        // look into recognizing entities...
        // luisRecognizer.recognize(groupsAffected,process.env.LuisConnectionString,
        //     function (error:Error,intents?: IIntent[],entities?: IEntity[]):void {
        //     console.log(entities);
        // });
        session.endDialogWithResult({response : vulnerableGroupsArray});
    }
]);

rcdaBot.dialog("/favorable_response_modalities",[
    function (session:Session,args:any,next:any):void {
        // tslint:disable-next-line:max-line-length
        Prompts.text(session,"What are the top three response modalities (comma separated) you would favour? (Chose among cash assistance, Service provision, in kind, etc.). If cash selected, verify that markets are functioning…");
    },
    function (session:Session,results:any,next:any):void {
        let responseModalities:string = results.response;
        const responseModalitiesArray:Array<string> = responseModalities.split(",");
        // look into recognizing entities...
        // luisRecognizer.recognize(groupsAffected,process.env.LuisConnectionString,
        //     function (error:Error,intents?: IIntent[],entities?: IEntity[]):void {
        //     console.log(entities);
        // });
        session.endDialogWithResult({response : responseModalitiesArray});
    }
]);

rcdaBot.dialog("/name",[
    function (session:Session):void {
        session.beginDialog("/ask_iana");
    },
    function (session:Session,results:any):void {
        session.beginDialog("/ask_people_affected");
    },
    function (session:Session,results:any):void {
        session.beginDialog("/ask_sector_concern");
        // session.beginDialog("/sector_severity");
    },
    function (session:Session,results: any):void {
        // implement session resumption functionality
        // session.conversationData.sector = session.conversationData.sector ? session.conversationData.sector : {};
        session.conversationData.sectorConcern = results.response;
       // console.log(session.conversationData);
        session.beginDialog("/sector_severity");
    },
    function (session:Session,results:any):void {
        console.log(results.response);
        session.conversationData.sectorSeverity = results.response;
        // console.log(session.conversationData);
        session.beginDialog("/sector_problem_factors");
    },
    function (session:Session,results:any):void {
        session.conversationData.sectorProblemFactors = results.response;
        console.log(session.conversationData);
        // tslint:disable-next-line:max-line-length
        session.send("Without more assistance than the one already provided, are you worried about your ability to meet your basic needs for the sectors you have chosen in the next 3 months?");
        session.beginDialog("/sector_future_concerns");
    },
    function (session:Session,results:any):void {
        session.conversationData.sectorFutureConcern = results.response;
        console.log(session.conversationData);
        session.beginDialog("/groups_requiring_immediate_assistance");
    },
    function (session:Session,results:any):void {
        session.conversationData.groupsRequiringImmediateAssistance = results.response;
        console.log(session.conversationData);
        session.beginDialog("/immediate_priority_sectors");
    },
    function (session:Session,results:any):void {
        session.conversationData.immediatePrioritySectors = results.response;
        console.log(session.conversationData);
        session.beginDialog("/immediate_vulnerable_groups");
    },
    function (session:Session,results:any):void {
        session.conversationData.immediateVulnerableGroups = results.response;
        console.log(session.conversationData);
        session.beginDialog("/favorable_response_modalities");
    },
    function (session:Session,results:any):void {
        session.conversationData.favorableResponseModalities = results.response;
        console.log(session.conversationData);
        Prompts.confirm(session,"I have recorded your data. Do you want to review this data once?",{listStyle: ListStyle.button});
    },
    function (session:Session,results:any):void {
        const beautifiedJsonReport:string = jsBeautify.js_beautify(
            JSON.stringify(session.conversationData),
            {indent_size: 4,end_with_newline:true});
        console.log(beautifiedJsonReport);
        rcdaDataStorageDb.collection(rcdaDataStorageCollectionName).insertOne(session.conversationData,
            function(err:Error,operationResult:any):void {
                console.log(err);
                console.log(operationResult);
                console.log(JSON.stringify(operationResult));
                if (err) {
                    throw "There was an issue while storing the data";
                }
                // const documentId:string = "1";
                session.send("Thanks for providing this data!");
                // session.send(`Your Report ID is -- ${documentId}`);
                if (results.response === true) {
                    session.endConversation(beautifiedJsonReport);
                } else {
                    session.endConversation();
                }
        });
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
        session.endDialog();
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
    // enable Application Insights
    const appInsightsKey:string = process.env.APPINSIGHTS_INSTRUMENTATIONKEY;
    applicationInsights.setup(appInsightsKey).start();
    listener(req, context.res);
};