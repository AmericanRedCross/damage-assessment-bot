import TestModel from "RedCross.Rcda.Common/models/TestModel";
import TestRepo from "@/repo/TestRepo";
import { injectable } from "inversify";

@injectable()
export default class TestService {
    
    constructor(private testRepo: TestRepo) { }

    getMessage(): TestModel {
        return this.testRepo.getMessage();
    }
}