import { Context, HttpMethod, HttpRequest, HttpResponse, HttpStatusCode } from "azure-functions-ts-essentials";
import TestService from "@/services/TestService";

// since this is an exported module object, these factory methods can be reassigned for mocking/test purposes
export const dependencies: { testService(): TestService } = {
  testService: () => TestService.create()
};

export function run(context: Context, req: HttpRequest): void {
  let res: HttpResponse;

  let testService: TestService = dependencies.testService();

  testService.getMessage();

  res = {
    status: HttpStatusCode.OK,
    body: testService.getMessage()
  };

  context.done(undefined, res);
}
