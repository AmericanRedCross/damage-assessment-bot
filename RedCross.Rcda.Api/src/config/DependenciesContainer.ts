import { Container } from "inversify";
import { interfaces, TYPE } from 'inversify-express-utils';

import TestController from "@/controllers/TestController";
import TestController2 from "@/controllers/TestController2";
import TestRepo from "@/repo/TestRepo";
import TestService from "@/services/TestService";

export default class DependenciesContainer extends Container {
    constructor() {
        super();
        
        this.bind<interfaces.Controller>(TYPE.Controller).to(TestController).whenTargetNamed('TestController');
        this.bind<interfaces.Controller>(TYPE.Controller).to(TestController2).whenTargetNamed('TestController2');
        this.bind<TestService>(TestService).toSelf();
        this.bind<TestRepo>(TestRepo).toSelf();
    }
}