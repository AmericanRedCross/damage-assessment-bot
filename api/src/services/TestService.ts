import TestRepo from "@/repo/TestRepo";

export default class TestService {

    constructor(private testRepo: TestRepo) { }

    public static create(): TestService {
        return new TestService(TestRepo.create());
    }

    getMessage(): any {
        return this.testRepo.getMessage();
    }
}