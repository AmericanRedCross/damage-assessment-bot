import { injectable } from "inversify";

@injectable()
export default class TestRepo {
    constructor() {
        
    }

    public getMessage(): any {
        return { msg: "hello from the backend" };
    }
}