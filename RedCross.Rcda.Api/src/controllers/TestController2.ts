import { Request } from 'express';
import { Controller, Get, interfaces } from 'inversify-express-utils';
import { injectable, inject } from 'inversify';
import TestModel from "RedCross.Rcda.Common/models/TestModel";

@Controller('/test2')
@injectable()
export default class TestController2 implements interfaces.Controller {
    
    constructor() {}
    
    @Get('/')
    private index(req: Request): TestModel {
        return {
            msg: "Hello from test2"
        };
    }
}