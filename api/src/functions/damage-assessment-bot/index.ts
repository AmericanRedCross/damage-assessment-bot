import { ChatConnector, UniversalBot, Middleware, Prompts, Session, LuisRecognizer, TextFormat } from "botbuilder";
import {MongoClient, MongoError} from "mongodb";
import {MongoBotStorage} from "botbuilder-storage";
import * as gena from "./dialogs/ask_iana_details";
import { Dictionary } from "async";

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

MongoClient.connect(mongoDbHostUri,
    {useNewUrlParser: true,auth:{user:mongoDbUsername,password:mongodbPassword}},
    function (err:MongoError,client:MongoClient): any {
        if (err) {
           throw err;
        }
        const connectionSettings: any = {
             collection: process.env.MongoDbBotStateCollectionName,
             ttl: {
                 userData: process.env.MongoDbTtlInSeconds,
                 conversationData: process.env.MongoDbTtlInSeconds,
                 privateConversationData: process.env.MongoDbTtlInSeconds
             }
   };
   const db:any = client.db(process.env.MongoDbName);
   const botStorageAdapter:MongoBotStorage = new MongoBotStorage(db,connectionSettings);

   rcdaBot.set("storage",botStorageAdapter);
});

const recognizer:any = new LuisRecognizer(process.env.LuisConnectionString);
rcdaBot.recognizer(recognizer);

console.log(recognizer);
rcdaBot.dialog("GreetingDialog",
    function (session:Session):any {
        session.send("You have reached the Greeting intent. You said %s",session.message.text);
        session.sendTyping();
        session.endDialog("Ending this conversation :'(");
    }
).triggerAction({
    matches: "Greeting"
});

//rcdaBot.dialog("/",function (session:Session):any {
//    session.sendTyping();
//    session.send("Hello! Your name is %s?",session.userData.Name);
//    session.sendTyping();
//    session.endConversation("Thank you for passing the data!");
//});

// rcdaBot.use(Middleware.firstRun({ version: 1.0, dialogId: "*:/name" }));


rcdaBot.dialog("/name",[
    function (session:any): any {
        Prompts.text(session,"Hi! What's your name?");
    },
    function (session:Session,results: any): any {
        session.userData.Name = results.response;
        console.log(session.message.user.id);
        session.sendTyping();
        console.log(typeof results);
        session.send("Sending you to Global ENA Data Collection");
        session.replaceDialog("/ask_iana");
    }
]
);

let genaFormData:Map<string,string> = new Map();
let sectorProblem:Map<string,boolean> = new Map();

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
            sectorProblem.set();
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
            sectorProblem.set("health_sector_concern",true);
        } else {
            sectorProblem.set("health_sector_concern",false);
        }
        Prompts.confirm(session,"Do you have a concern in **FOOD** sector?",{textFormat:TextFormat.markdown});
    },
    function (session:Session,results:any):void {
        const confirmation:string = results.response.toString();
        if (confirmation.toLowerCase() === "yes") {
            sectorProblem.set("food_sector_concern",true);
        } else {
            sectorProblem.set("food_sector_concern",false);
        }
        Prompts.confirm(session,"Do you have a concern in **WASH** sector?",{textFormat:TextFormat.markdown});
    },
    function (session:Session,results:any):void {
        const confirmation:string = results.response.toString();
        if (confirmation.toLowerCase() === "yes") {
            sectorProblem.set("wash_sector_concern",true);
        } else {
            sectorProblem.set("wash_sector_concern",false);
        }
        Prompts.confirm(session,"Do you have a concern in **SHELTER/NFI** sector?",{textFormat:TextFormat.markdown});
    },
    function (session:Session,results:any):void {
        const confirmation:string = results.response.toString();
        if (confirmation.toLowerCase() === "yes") {
            sectorProblem.set("shelter_sector_concern",true);
        } else {
            sectorProblem.set("shelter_sector_concern",false);
        }
        Prompts.confirm(session,"Do you have a concern in **PROTECTION** sector?",{textFormat:TextFormat.markdown});
    },
    function (session:Session,results:any):void {
        const confirmation:string = results.response.toString();
        if (confirmation.toLowerCase() === "yes") {
            sectorProblem.set("protection_sector_concern",true);
        } else {
            sectorProblem.set("protection_sector_concern",false);
        }
        Prompts.confirm(session,"Do you have a concern in **EDUCATION** sector?",{textFormat:TextFormat.markdown});
    },
    function (session:Session,results:any):void {
        const confirmation:string = results.response.toString();
        if (confirmation.toLowerCase() === "yes") {
            sectorProblem.set("education_sector_concern",true);
        } else {
            sectorProblem.set("education_sector_concern",false);
        }
        Prompts.confirm(session,"Do you have a concern in **LIVELIHOOD** sector?",{textFormat:TextFormat.markdown});
    },
    function (session:Session,results:any):void {
        const confirmation:string = results.response.toString();
        if (confirmation.toLowerCase() === "yes") {
            sectorProblem.set("livelihood_sector_concern",true);
        } else {
            sectorProblem.set("livelihood_sector_concern",false);
        }
        Prompts.confirm(session,"Do you have a concern in **OTHER** sector ?",{textFormat:TextFormat.markdown});
    }
]);

// environment glue
module.exports = function (context: any, req: any): any {
    context.log("Passing body", req.body);
    listener(req, context.res);
};