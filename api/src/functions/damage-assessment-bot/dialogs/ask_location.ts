import { ChatConnector, UniversalBot, Middleware, Prompts, Session, SessionLogger } from "botbuilder";
import "botbuilder-azure";
import "botbuilder-location";
import { AzureBotStorage,DocumentDbClient } from "botbuilder-azure";

const ask_location_dialog : any = [
    function PromptLocation(userSession:Session): any {
    }
];