import axios from "axios";
import TestModel from "RedCross.Rcda.Common/models/TestModel";

export default class ConfigService {

    async getConfigData(): Promise<TestModel> {
        const response = await axios.get<TestModel>('/api/test');
        return response.data;
    }
}