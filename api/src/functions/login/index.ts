import { HttpStatusCode } from "azure-functions-ts-essentials";
import rcdaHttpFunction from "@/function-utils/rcdaHttpFunction";
import LoginService from "@/services/LoginService";
import LoginRequest from "@common/models/login/LoginRequest";
import LoginResponse from "@common/models/login/LoginResponse";

class LoginRequestDependencies {

  public loginService: LoginService;

  constructor() {
    this.loginService = LoginService.getInstance();
  }
}

export default rcdaHttpFunction<LoginRequest, LoginResponse, LoginRequestDependencies>(
  LoginRequestDependencies,
  false,
  async (req, { loginService }) => {

    let loginResponse = await loginService.login(req.body);

    return { 
      status: HttpStatusCode.OK,
      body: loginResponse
    };
  });