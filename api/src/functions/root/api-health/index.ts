import { HttpStatusCode } from "azure-functions-ts-essentials";
import rcdaHttpFunction from "@/functions/utils/rcdaHttpFunction";
import DateUtility from "@/services/utils/DateUtility";

class HealthDependencies {

    constructor(public dateUtility: DateUtility) { }

    static getInstance() {
        return new HealthDependencies(DateUtility.getInstance());
    }
}

export default rcdaHttpFunction<null, null, HealthDependencies>(
HealthDependencies.getInstance,
false,
async (req, { dateUtility }, { context }) => {

    const timeStamp = dateUtility.currentDateString();

    context.log('Health check function is running at -- ', timeStamp);

    return {
        status: HttpStatusCode.OK,
        body: null,
    };
});