import { ListStyle, Prompts, TextFormat } from "botbuilder";
import rcdaChatDialog from "@/chat/utils/rcdaChatDialog";
import DisasterAssessmentRepo from "@/repo/DisasterAssessmentRepo";

const askSectorConcernDialog = rcdaChatDialog(
    "/ask_sector_concern",
    null,
    [
        ({ session, result }) => {
            // session.dialogData.index = args ? args.index : 0;
            // session.dialogData.form = args ? args.sectorConcern : {};
            if (!result) {
                session.dialogData.form = {};
                session.dialogData.index = 0;
            } else {
                session.dialogData.form = result.form;
                session.dialogData.index = result.index;
            }
            Prompts.confirm(session, `Do you have a concern in sector **${concernSectors[session.dialogData.index]}** ?`,
                { listStyle: ListStyle.button });
        },
        ({ session, result }) => {
            const sector: string = concernSectors[session.dialogData.index++];
            const isConcernInSector: string = result.response;
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


const askPeopleAffectedDialog = rcdaChatDialog(
    "/ask_people_affected",
    null,
    [
        ({ session }) => {
            Prompts.number(session, "What is the number of people before disaster?", { integerOnly: true });
        },
        ({ session, result }) => {
            session.conversationData.numberOfPeopleBeforeDisaster = result.response;
            genaFormData.set("numberOfPeopleBeforeDisaster", result.response);
            Prompts.number(session, "What is the number of people who have left the area?", { integerOnly: true });
        },
        ({ session, result }) => {
            session.conversationData.numberOfPeopleLeftArea = result.response;
            genaFormData.set("numberOfPeopleLeftArea", result.response);
            Prompts.number(session, "What is the number of people who have returned?", { integerOnly: true });
        },
        ({ session, result }) => {
            session.conversationData.numberOfPeopleReturned = result.response;
            genaFormData.set("numberOfPeopleReturned", result.response);
            Prompts.number(session, "What is the number of people currently living in the area?", { integerOnly: true });
        },
        ({ session, result }) => {
            session.conversationData.numberOfPeopleLivingCurrently = result.response;
            genaFormData.set("numberOfPeopleLivingCurrently", result.response);
            Prompts.number(session, "What is the total number (SUM) of people affected?", { integerOnly: true });
        },
        ({ session, result }) => {
            session.conversationData.totalNumberOfPeopleAffected = result.response;
            genaFormData.set("totalNumberOfPeopleAffected", result.response);
            Prompts.number(session, "What is the number of people who have been displaced?", { integerOnly: true });
        },
        ({ session, result }) => {
            session.conversationData.numberOfPeopleDisplaced = result.response;
            genaFormData.set("numberOfPeopleDisplaced", result.response);
            Prompts.number(session, "What is the number of people affected who haven't displaced?", { integerOnly: true });
        },
        ({ session, result }) => {
            session.conversationData.numberOfPeopleNotDisplaced = result.response;
            genaFormData.set("numberOfPeopleNotDisplaced", result.response);
            Prompts.number(session, "What is the number of casualties?", { integerOnly: true });
        },
        ({ session, result }) => {
            session.conversationData.numberOfCasualties = result.response;
            session.endDialog();
        }
    ]);

const askSectorProblemFactorsDialog = rcdaChatDialog(
    "/sector_problem_factors",
    null,
    [
        ({ session, result, skip }) => {
            if (!result) {
                session.dialogData.form = {};
                session.dialogData.index = 0;
                // console.log(concernSectors);
                console.log(session.dialogData);
            } else {
                session.dialogData.form = result.form;
                session.dialogData.index = result.index;
            }
            skip();
        },
        ({ session, result, skip }) => {
            if (session.conversationData.sectorConcern[concernSectors[session.dialogData.index]]) {
                Prompts.number(session, `What is the factor scoring in Access in **${concernSectors[session.dialogData.index]}** sector?`,
                    { textFormat: TextFormat.markdown });
            } else {
                skip();
            }
        },
        ({ session, result, skip }) => {
            const sector: string = concernSectors[session.dialogData.index];
            let sectorConcernFactorScore: number = result.response;
            session.dialogData.form[sector] = {};
            if (sectorConcernFactorScore === undefined) {
                sectorConcernFactorScore = 0;
            }
            session.dialogData.form[sector].Access = sectorConcernFactorScore;
            console.log(session.dialogData.form);
            if (session.conversationData.sectorConcern[concernSectors[session.dialogData.index]]) {
                Prompts.number(session, `What is the factor scoring in Availability in **${concernSectors[session.dialogData.index]}** sector?`,
                    { textFormat: TextFormat.markdown });
            } else {
                skip();
            }
        },
        ({ session, result, skip }) => {
            const sector: string = concernSectors[session.dialogData.index];
            let sectorConcernFactorScore: number = result.response;
            if (sectorConcernFactorScore === undefined) {
                sectorConcernFactorScore = 0;
            }
            session.dialogData.form[sector].Availability = sectorConcernFactorScore;
            if (session.conversationData.sectorConcern[concernSectors[session.dialogData.index]]) {
                Prompts.number(session, `What is the factor scoring in Quality in **${concernSectors[session.dialogData.index]}** sector?`,
                    { textFormat: TextFormat.markdown });
            } else {
                skip();
            }
        },
        ({ session, result, skip }) => {
            const sector: string = concernSectors[session.dialogData.index];
            let sectorConcernFactorScore: number = result.response;
            if (sectorConcernFactorScore === undefined) {
                sectorConcernFactorScore = 0;
            }
            session.dialogData.form[sector].Quality = sectorConcernFactorScore;
            if (session.conversationData.sectorConcern[concernSectors[session.dialogData.index]]) {
                Prompts.number(session, `What is the factor scoring in Use in **${concernSectors[session.dialogData.index]}** sector?`,
                    { textFormat: TextFormat.markdown });
            } else {
                skip();
            }
        },
        ({ session, result, skip }) => {
            const sector: string = concernSectors[session.dialogData.index++];
            let sectorConcernFactorScore: number = result.response;
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

const sectorFutureConcernsDialog = rcdaChatDialog(
    "/sector_future_concerns",
    null,
    [
        ({ session, result, skip }) => {
            if (!result) {
                session.dialogData.form = {};
                session.dialogData.index = 0;
            } else {
                session.dialogData.form = result.form;
                session.dialogData.index = result.index;
            }
            if (session.conversationData.sectorConcern[concernSectors[session.dialogData.index]]) {
                Prompts.number(session, `Do you have a future concern in **${concernSectors[session.dialogData.index]}** sector?`,
                    { textFormat: TextFormat.markdown });
            } else {
                skip();
            }
        },
        ({ session, result, skip }) => {
            const sector: string = concernSectors[session.dialogData.index++];
            let sectorFutureConcernScore: number = result.response;
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

const greetingDialog = rcdaChatDialog(
    "GreetingDialog",
    null,
    [
        ({ session, result, skip }) => {
            // session.send("You have reached the Greeting intent. You said %s",session.message.text);
            // session.sendTyping();
            // session.endDialog("Ending this conversation :'(");
            session.send("Testing feature...");
            Prompts.confirm(session, "Select Yes,No", { listStyle: ListStyle.button });
        },
        ({ session, result, skip }) => {
            console.log(result.response);
            session.send(`You typed in -- ${result.response.toString()}`);
        }
    ],
    {
        triggers: [
            { matches: "HelloWorld" }
        ]
    });

let concernSectors: Array<string> = new Array("Health", "Food", "Wash", "Shelter/NFI", "Protection", "Education", "Livelihood", "Other");
let genaFormData: Map<string, string> = new Map();
let sectorConcern: Map<string, boolean> = new Map();

const sectorSeverityDialog = rcdaChatDialog(
    "/sector_severity",
    null,
    [
        ({ session, result, skip }) => {
            if (!result) {
                session.dialogData.form = {};
                session.dialogData.index = 0;
            } else {
                session.dialogData.form = result.form;
                session.dialogData.index = result.index;
            }
            if (session.conversationData.sectorConcern[concernSectors[session.dialogData.index]]) {
                Prompts.number(session, `What is the severity of concern in **${concernSectors[session.dialogData.index]}** sector?`,
                    { textFormat: TextFormat.markdown });
            } else {
                skip();
            }
        },
        ({ session, result, skip }) => {
            const sector: string = concernSectors[session.dialogData.index++];
            const sectorConcernSeverity: number = result.response;
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

const groupsRequiringAssistanceDialog = rcdaChatDialog(
    "/groups_requiring_immediate_assistance",
    null,
    [
        ({ session, result, skip }) => {
            Prompts.text(session, "Who are the top three affected groups (comma-separated) that require immediate assistance in this area?");
        },
        ({ session, result, skip }) => {
            let groupsAffected: string = result.response;
            const groupsAffectedArray: Array<string> = groupsAffected.split(",");
            // look into recognizing entities...
            // luisRecognizer.recognize(groupsAffected,process.env.LuisConnectionString,
            //     (error:Error,intents?: IIntent[],entities?: IEntity[]):void {
            //     console.log(entities);
            // });
            session.endDialogWithResult({ response: groupsAffectedArray });
        }
    ]);

const immediatePrioritySectorsDialog = rcdaChatDialog(
    "/immediate_priority_sectors",
    null,
    [
        ({ session, result, skip }) => {
            Prompts.text(session, "What are the top three priority sectors (comma separated) requiring immediate assistance in this area?");
        },
        ({ session, result, skip }) => {
            let immediatePrioritySectors: string = result.response;
            const immediatePrioritySectorsArray: Array<string> = immediatePrioritySectors.split(",");
            // look into recognizing entities...
            // luisRecognizer.recognize(groupsAffected,process.env.LuisConnectionString,
            //     (error:Error,intents?: IIntent[],entities?: IEntity[]):void {
            //     console.log(entities);
            // });
            session.endDialogWithResult({ response: immediatePrioritySectorsArray });
        }
    ]);

const immediateVulnerableGroupsDialog = rcdaChatDialog(
    "/immediate_vulnerable_groups",
    null,
    [
        ({ session, result, skip }) => {
            Prompts.text(session, "What are the top three vulnerable groups (comma separated) requiring immediate assistance in this area?");
        },
        ({ session, result, skip }) => {
            let vulnerableGroups: string = result.response;
            const vulnerableGroupsArray: Array<string> = vulnerableGroups.split(",");
            // look into recognizing entities...
            // luisRecognizer.recognize(groupsAffected,process.env.LuisConnectionString,
            //     (error:Error,intents?: IIntent[],entities?: IEntity[]):void {
            //     console.log(entities);
            // });
            session.endDialogWithResult({ response: vulnerableGroupsArray });
        }
    ]);

const favorableResponseModalitiesDialog = rcdaChatDialog(
    "/favorable_response_modalities",
    null,
    [
        ({ session, result, skip }) => {
            // tslint:disable-next-line:max-line-length
            Prompts.text(session, "What are the top three response modalities (comma separated) you would favour? (Chose among cash assistance, Service provision, in kind, etc.). If cash selected, verify that markets are functioning…");
        },
        ({ session, result, skip }) => {
            let responseModalities: string = result.response;
            const responseModalitiesArray: Array<string> = responseModalities.split(",");
            // look into recognizing entities...
            // luisRecognizer.recognize(groupsAffected,process.env.LuisConnectionString,
            //     (error:Error,intents?: IIntent[],entities?: IEntity[]):void {
            //     console.log(entities);
            // });
            session.endDialogWithResult({ response: responseModalitiesArray });
        }
    ]);

const disasterNameQuestions: Array<string> = ["Could you please tell me the name of the disaster?", "What is the name of the disaster?"];

const askUserInfoDialog = rcdaChatDialog(
    "/ask_iana",
    null,
    [
        ({ session }) => {
            session.send("Hello! This is ARC bot ready to collect Global ENA Data");
            Prompts.text(session, disasterNameQuestions);
        },
        ({ session, result, skip }) => {
            session.conversationData.disasterName = result.response;
            session.conversationData.date = (new Date(Date.now())).toISOString();
            Prompts.text(session, "What is your complete name?");
        },
        ({ session, result, skip }) => {
            session.conversationData.enumerator = result.response;
            Prompts.text(session, "Please provide Geographical Area Name");
        },
        ({ session, result, skip }) => {
            session.conversationData.adminStack = result.response;
            Prompts.choice(session, "Setting?", ["Urban", "Rural", "Semi-Urban"], { listStyle: ListStyle.button });
        },
        ({ session, result, skip }) => {
            session.conversationData.setting = result.response;
            session.endDialog();
        }
    ]);

    
export const myanmarDisasterAssessmentDialog = rcdaChatDialog(
    "/disasterAssessmentMyanmar",
    () => ({
        disasterAssessmentRepo: DisasterAssessmentRepo.getInstance()
    }),
    [
        ({ session }) => {
            session.beginDialog(askUserInfoDialog.id);
        },
        ({ session, result }) => {
            session.beginDialog("/ask_people_affected");
        },
        ({ session, result }) => {
            session.beginDialog("/ask_sector_concern");
            // session.beginDialog("/sector_severity");
        },
        ({ session, result }) => {
            // implement session resumption functionality
            // session.conversationData.sector = session.conversationData.sector ? session.conversationData.sector : {};
            session.conversationData.sectorConcern = result.response;
            // console.log(session.conversationData);
            session.beginDialog("/sector_severity");
        },
        ({ session, result }) => {
            console.log(result.response);
            session.conversationData.sectorSeverity = result.response;
            // console.log(session.conversationData);
            session.beginDialog("/sector_problem_factors");
        },
        ({ session, result }) => {
            session.conversationData.sectorProblemFactors = result.response;
            console.log(session.conversationData);
            // tslint:disable-next-line:max-line-length
            session.send("Without more assistance than the one already provided, are you worried about your ability to meet your basic needs for the sectors you have chosen in the next 3 months?");
            session.beginDialog("/sector_future_concerns");
        },
        ({ session, result }) => {
            session.conversationData.sectorFutureConcern = result.response;
            console.log(session.conversationData);
            session.beginDialog("/groups_requiring_immediate_assistance");
        },
        ({ session, result }) => {
            session.conversationData.groupsRequiringImmediateAssistance = result.response;
            console.log(session.conversationData);
            session.beginDialog("/immediate_priority_sectors");
        },
        ({ session, result }) => {
            session.conversationData.immediatePrioritySectors = result.response;
            console.log(session.conversationData);
            session.beginDialog("/immediate_vulnerable_groups");
        },
        ({ session, result }) => {
            session.conversationData.immediateVulnerableGroups = result.response;
            console.log(session.conversationData);
            session.beginDialog("/favorable_response_modalities");
        },
        ({ session, result }) => {
            session.conversationData.favorableResponseModalities = result.response;
            console.log(session.conversationData);
            Prompts.confirm(session, "I have recorded your data. Do you want to review this data once?", { listStyle: ListStyle.button });
        },
        async ({ session, result }, { disasterAssessmentRepo }) => {
            const jsonReport: string = JSON.stringify(session.conversationData, null, 4);
            console.log(jsonReport);

            //TODO review format of object
            await disasterAssessmentRepo.create(session.conversationData);
                        
            session.send("Thanks for providing this data!");

            if (result.response === true) {
                session.endConversation(jsonReport);
            } else {
                session.endConversation();
            }
        }
    ],
    {
        triggers: [
            { matches: "Greeting" }
        ]
    });


const myanmarFormDialogs = [
    myanmarDisasterAssessmentDialog,
    askSectorConcernDialog,
    askPeopleAffectedDialog,
    askSectorProblemFactorsDialog,
    sectorFutureConcernsDialog,
    greetingDialog,
    sectorSeverityDialog,
    groupsRequiringAssistanceDialog,
    immediatePrioritySectorsDialog,
    immediateVulnerableGroupsDialog,
    favorableResponseModalitiesDialog,
    askUserInfoDialog
];
export default myanmarFormDialogs;