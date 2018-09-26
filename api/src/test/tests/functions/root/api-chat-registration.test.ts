import apiChatRegistration, { ChatRegistrationDependencies } from "@/functions/root/api-chat-registration/index";
import ChatRegistrationService from "@/services/ChatRegistrationService";
import { HttpStatusCode } from "azure-functions-ts-essentials";
import HttpRequestMock from "@/test/mocks/HttpRequestMock";
import genericMock from "@/test/mocks/genericMock";
import testRcdaHttpFunction from "@/test/utils/testRcdaHttpFunction";
import ChatRegistrationRequest from "@common/models/services/chat-registration/ChatRegistrationRequest";
import ChatRegistrationRepo from "@/repo/ChatRegistrationRepo";
import UserRepo from "@/repo/UserRepo";
import TestChatRegistrationModel from "@/test/data/TestChatRegistrationModel";
import { TestUserSession } from "@/test/data/TestUserSession";
import TestUserModel from "@/test/data/TestUserModel";
import { RcdaHttpResponseError } from "@/functions/utils/rcda-http-types";
import { RcdaErrorTypes } from "@common/system/RcdaError";
import { RcdaRoles } from "@common/system/RcdaRoles";

describe("api/chat/registration function", () => {
    
    describe("happy path", () => { 

        // Arrange
        let mockChatRegistrationRepo = genericMock<ChatRegistrationRepo>({ 
            get: async (id) => TestChatRegistrationModel.Valid(id) 
        });
        let mockUserRepo = genericMock<UserRepo>({
            get: async (id) => TestUserModel.Valid(id)
        });
        let chatRegistrationService = new ChatRegistrationService(mockChatRegistrationRepo, mockUserRepo)

        let userSession = TestUserSession.Valid();
        let httpRequest = new HttpRequestMock<ChatRegistrationRequest>({
            body: {
                registrationToken: "fake-token"
            },
            userSession: userSession
        });

        // Act
        let asyncAction = testRcdaHttpFunction({
            definition: apiChatRegistration,
            dependencies: { chatRegistrationService },
            request: httpRequest
        });

        // Assert    
        it("should fetch chat registration record from the repo once", async () => {
            await asyncAction;
            expect(mockChatRegistrationRepo.$calls.get.length).toBe(1);
        }); 

        it("should fetch chat registration record using registration token", async () => {
            await asyncAction;
            expect(mockChatRegistrationRepo.$calls.get[0][0]).toBe(httpRequest.body.registrationToken);
        });
   
        it("should fetch user record from the repo once", async () => {
            await asyncAction;
            expect(mockUserRepo.$calls.get.length).toBe(1);
        }); 

        it("should fetch user record using user id in session", async () => {
            await asyncAction;
            expect(mockUserRepo.$calls.get[0][0]).toBe(userSession.userId);
        });
        
        it("should delete registration token", async () => {
            await asyncAction;
            expect(mockChatRegistrationRepo.$calls.delete.length).toBe(1);
        });
        
        it("should update the user", async () => {
            await asyncAction;
            expect(mockUserRepo.$calls.update.length).toBe(1);
        });

        it("should return response with OK status", async () => {
            let result = await asyncAction;
            expect(result.status).toBe(HttpStatusCode.OK);
        });

        it("should return response with empty body", async () => {
            let result = await asyncAction;
            expect(result.body).toBeNull();
        });
    });
    
    describe("invalid registration token", () => { 
        
        // Arrange
        let mockChatRegistrationRepo = genericMock<ChatRegistrationRepo>({ 
            get: async (id) => null
        });
        let mockUserRepo = genericMock<UserRepo>();
        let chatRegistrationService = new ChatRegistrationService(mockChatRegistrationRepo, mockUserRepo)

        let userSession = TestUserSession.Valid();
        let httpRequest = new HttpRequestMock<ChatRegistrationRequest>({
            body: {
                registrationToken: "fake-token"
            },
            userSession: userSession
        });

        // Act
        let asyncAction = testRcdaHttpFunction({
            definition: apiChatRegistration,
            dependencies: { chatRegistrationService },
            request: httpRequest
        });

        // Assert  
        it("should attempt to fetch chat registration", async () => {
            await asyncAction;
            expect(mockChatRegistrationRepo.$calls.get.length).toBe(1);
        });

        it("should not touch user repo", async () => {
            await asyncAction;
            let userRepoCalledMethods = Object.keys(mockUserRepo.$calls);
            expect(userRepoCalledMethods.length).toBe(0);
        });

        it("should return response with Bad Request status", async() => {
            let result = await asyncAction;
            expect(result.status).toBe(HttpStatusCode.BadRequest);
        });

        it("should return error response", async() => {
            let body = <RcdaHttpResponseError>(await asyncAction).body;
            expect(body.error).not.toBeNull();
        });

        describe("error response", () => {

            it("should have code 'ClientError'", async() => {
                let body = <RcdaHttpResponseError>(await asyncAction).body;
                expect(body.error.code).toBe(RcdaErrorTypes.ClientError)
            });
            
            it("should have error message", async() => {
                let body = <RcdaHttpResponseError>(await asyncAction).body;
                expect(body.error.message).toBe("The provided registration token is invalid.")
            });
        });
    });

    
    describe("auth policy", () => { 
        
        function testAuthPolicy(roles: RcdaRoles[]|null) {
            // Arrange
            let chatRegistrationService = genericMock<ChatRegistrationService>({ 
                register: async (id) => null
            });
            let httpRequest = new HttpRequestMock<ChatRegistrationRequest>({
                body: {
                    registrationToken: "fake-token"
                },
                userSession: roles !== null ? TestUserSession.Valid({ roles }) : null
            });
    
            // Act
            return testRcdaHttpFunction({
                definition: apiChatRegistration,
                dependencies: { chatRegistrationService },
                request: httpRequest
            });
        }

        // Assert  
        test("session with unnecessary role should be authorized", async () => {
            let result = await testAuthPolicy([RcdaRoles.DashboardAdmin]);
            expect(result.status).toBe(HttpStatusCode.OK);
        });

        test("session without any roles should be authorized", async () => {
            let result = await testAuthPolicy([]);
            expect(result.status).toBe(HttpStatusCode.OK);
        });

        test("missing session token returns Unauthorized status", async () => {
            let result = await testAuthPolicy(null);
            expect(result.status).toBe(HttpStatusCode.Unauthorized);
        })
    });
});