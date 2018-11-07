import { HttpStatusCode } from "azure-functions-ts-essentials";
import rcdaHttpFunction from "@/functions/utils/rcdaHttpFunction";
import LoginService from "@/services/LoginService";
import LoginRequest from "@common/models/services/login/LoginRequest";
import LoginResponse from "@common/models/services/login/LoginResponse";

class LoginFunctionDependencies {

  constructor(public loginService: LoginService) {}

  static getInstance() {
    return new LoginFunctionDependencies(LoginService.getInstance());
  }
}

export default rcdaHttpFunction<LoginRequest, LoginResponse, LoginFunctionDependencies>(
  LoginFunctionDependencies.getInstance,
  false,
  async (req, { loginService }) => {

    let loginResponse = await loginService.login(req.body);

    return { 
      status: HttpStatusCode.OK,
      body: loginResponse
    };
  });