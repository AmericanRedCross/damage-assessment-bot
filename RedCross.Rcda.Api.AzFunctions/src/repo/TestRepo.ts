export default class TestRepo {

    public static create(): TestRepo {
        return new TestRepo();
    }

    public getMessage(): any {
        return { msg: "hello from the backend" };
    }
}