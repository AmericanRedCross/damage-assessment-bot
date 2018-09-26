import apiChatPromptReport from "@/functions/root/api-chat-prompt-report/index";
import ChatPromptReportService from "@/services/ChatPromptReportService";
import { HttpStatusCode } from "azure-functions-ts-essentials";
import HttpRequestMock from "@/test/mocks/HttpRequestMock";
import genericMock from "@/test/mocks/genericMock";
import testRcdaHttpFunction from "@/test/utils/testRcdaHttpFunction";
import ChatPromptReportRequest from "@common/models/services/chat-prompt-report/ChatPromptReportRequest";
import UserRepo from "@/repo/UserRepo";
import { TestUserSession } from "@/test/data/TestUserSession";
import TestUserModel from "@/test/data/TestUserModel";
import { RcdaHttpResponseError } from "@/functions/utils/rcda-http-types";
import { RcdaErrorTypes } from "@common/system/RcdaError";
import { RcdaRoles } from "@common/system/RcdaRoles";
import RcdaCountries from "@common/system/RcdaCountries";

describe("api/chat/prompt/report function", () => {
    
    describe("happy path", () => { 

        // Arrange
        let mockUserRepo = genericMock<UserRepo>({
            getAllByCountry: async () => []
        });
        let chatPromptReportService = new ChatPromptReportService(mockUserRepo);
        let context = { bindings: {} };

        let httpRequest = new HttpRequestMock<ChatPromptReportRequest>({
            body: {
                country: RcdaCountries.Myanmar
            },
            userSession: TestUserSession.Valid({ roles: [RcdaRoles.DashboardAdmin] })
        });

        // Act
        let asyncAction = testRcdaHttpFunction({
            definition: apiChatPromptReport,
            dependencies: { chatPromptReportService },
            request: httpRequest,
            context
        });

        // Assert       
        it("should fetch users associated with country", async () => {
            await asyncAction;
            expect(mockUserRepo.$calls.getAllByCountry.length).toBe(1);
            expect(mockUserRepo.$calls.getAllByCountry[0][0]).toBe(httpRequest.body.country);
        });

        it("should return queue items as context binding", async () => {
            await asyncAction;
            expect((<any>context.bindings).queueItems).not.toBeNull();
            //TODO this test could be improved, i.e. verify item count/values
        })

        it("should return response with Accepted status", async () => {
            let result = await asyncAction;
            expect(result.status).toBe(HttpStatusCode.Accepted);
        });

        it("should return response with empty body", async () => {
            let result = await asyncAction;
            expect(result.body).toBeNull();
        });
    });
    
    describe("invalid country in request", () => { 
        
        // Arrange
        let mockUserRepo = genericMock<UserRepo>({
            get: async (id) => TestUserModel.Valid(id)
        });
        let chatPromptReportService = new ChatPromptReportService(mockUserRepo)

        let userSession = TestUserSession.Valid();
        let httpRequest = new HttpRequestMock<ChatPromptReportRequest>({
            body: {
                country: "invalid-country"
            },
            userSession: TestUserSession.Valid({ roles: [RcdaRoles.DashboardAdmin] })
        });

        // Act
        let asyncAction = testRcdaHttpFunction({
            definition: apiChatPromptReport,
            dependencies: { chatPromptReportService },
            request: httpRequest
        });

        // Assert  
        it("should return response with BadRequest status", async () => {
            let result = await asyncAction;
            expect(result.status).toBe(HttpStatusCode.BadRequest);
        });

        describe("error response", () => {

            it("should have code 'ClientError'", async() => {
                let body = <RcdaHttpResponseError>(await asyncAction).body;
                expect(body.error.code).toBe(RcdaErrorTypes.ClientError)
            });
            
            it("should have error message", async() => {
                let body = <RcdaHttpResponseError>(await asyncAction).body;
                expect(body.error.message).toBe("Invalid country specified in request")
            });
        });
    });

    
    describe("auth policy", () => { 
        
        function testAuthPolicy(roles: RcdaRoles[]|null) {
            // Arrange
            let chatPromptReportService = genericMock<ChatPromptReportService>({
                getChatPromptQueueItems: async () => []
            });

            let userSession = TestUserSession.Valid();
            let httpRequest = new HttpRequestMock<ChatPromptReportRequest>({
                body: {
                    country: "invalid-country"
                },
                userSession: roles !== null ? TestUserSession.Valid({ roles }) : null
            });

            // Act
            return testRcdaHttpFunction({
                definition: apiChatPromptReport,
                dependencies: { chatPromptReportService },
                request: httpRequest
            });
        }

        // Assert         
        test("session with required role is authorized", async () => {
            let result = await testAuthPolicy([RcdaRoles.DashboardAdmin]);
            expect(result.status).toBe(HttpStatusCode.Accepted);
        });

        test("session without any roles returns Forbidden status", async () => {
            let result = await testAuthPolicy([]);
            expect(result.status).toBe(HttpStatusCode.Forbidden);
        });

        test("session with wrong role returns Forbidden status", async () => {
            let result = await testAuthPolicy([RcdaRoles.SystemAdmin]);
            expect(result.status).toBe(HttpStatusCode.Forbidden);
        });

        test("missing session token returns Unauthorized status", async () => {
            let result = await testAuthPolicy(null);
            expect(result.status).toBe(HttpStatusCode.Unauthorized);
        });
    });
});