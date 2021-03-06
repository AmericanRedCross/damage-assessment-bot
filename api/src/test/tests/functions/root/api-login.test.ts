import apiLogin from "@/functions/root/api-login/index";
import { HttpStatusCode } from "azure-functions-ts-essentials";
import HttpRequestMock from "@/test/mocks/HttpRequestMock";
import genericMock from "@/test/mocks/genericMock";
import testRcdaHttpFunction from "@/test/utils/testRcdaHttpFunction";
import UserRepo from "@/repo/UserRepo";
import { TestUserSession } from "@/test/data/TestUserSession";
import TestUserModel from "@/test/data/TestUserModel";
import { RcdaRoles } from "@common/system/RcdaRoles";
import LoginService from "@/services/LoginService";
import IfrcGoAuthRepo from "@/repo/IfrcGoAuthRepo";
import LoginRequest from "@common/models/services/login/LoginRequest";
import LoginResponse from "@common/models/services/login/LoginResponse";
import TestSessionUtility from "@/test/utils/TestSessionUtility";

describe("api/v1/login function", () => {
    
    describe("happy path", () => { 

        // Arrange
        let mockIfrcAuthRepo = genericMock<IfrcGoAuthRepo>({
            getUserByLogin: async () => ({ id: "fake-id" })
        });
        let mockUserRepo = genericMock<UserRepo>({
            getByAccount: async () => TestUserModel.Valid()
        });
        let mockSessionUtility = new TestSessionUtility();

        let loginService = new LoginService(mockIfrcAuthRepo, mockUserRepo, mockSessionUtility);

        let httpRequest = new HttpRequestMock<LoginRequest>({
            body: {
                username: "test-user",
                password: "fake-password"
            },
            userSession: TestUserSession.Valid({ roles: [RcdaRoles.DashboardAdmin] })
        });

        // Act
        let asyncAction = testRcdaHttpFunction({
            definition: apiLogin,
            dependencies: { loginService },
            request: httpRequest
        });

        // Assert     
        it("should return response with OK status", async () => {
            let result = await asyncAction;
            expect(result.status).toBe(HttpStatusCode.OK);
        });

        it("should return response with body", async () => {
            let result = await asyncAction;
            expect(result.body).not.toBeNull();
        });

        describe("response body", () => {
            
            it("should have valid session token", async () => {
                let responseBody = <LoginResponse>(await asyncAction).body;
                expect(responseBody.sessionToken).not.toBeNull();
                expect(mockSessionUtility.getValidSession(responseBody.sessionToken)).not.toBeNull();
            });
        });
    });
        
    describe("auth policy", () => { 
        
        function testAuthPolicy(roles: RcdaRoles[]|null) {
            // Arrange

            let loginService = genericMock<LoginService>();

            let httpRequest = new HttpRequestMock<LoginRequest>({
                body: {
                    username: "test-user",
                    password: "fake-password"
                },
                userSession: roles !== null ? TestUserSession.Valid({ roles }) : null
            });

            // Act
            return testRcdaHttpFunction({
                definition: apiLogin,
                dependencies: { loginService },
                request: httpRequest
            });
        }

        // Assert    
        test("missing session token is authorized", async () => {
            let result = await testAuthPolicy(null);
            expect(result.status).toBe(HttpStatusCode.OK);
        });

        test("session with no role is authorized", async () => {
            let result = await testAuthPolicy([]);
            expect(result.status).toBe(HttpStatusCode.OK);
        });

        test("session with additional roles is authorized", async () => {
            let result = await testAuthPolicy([RcdaRoles.SystemAdmin]);
            expect(result.status).toBe(HttpStatusCode.OK);
        });
    });
});