import { Request } from 'express';
import { Controller, Get, interfaces } from 'inversify-express-utils';
import { injectable, inject } from 'inversify';
import TestService from "@/services/TestService";
import TestModel from "RedCross.Rcda.Common/models/TestModel";

@Controller('/test')
@injectable()
export default class TestController implements interfaces.Controller {
    
    constructor(private testService: TestService) {}
    
    @Get('/')
    private index(req: Request): TestModel {

        return this.testService.getMessage();
    }
}