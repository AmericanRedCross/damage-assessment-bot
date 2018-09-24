import RcdaError, { RcdaErrorTypes } from "@/common/errors/RcdaError";

export default class RcdaClientError extends RcdaError {
    typeId = RcdaErrorTypes.ClientError;
    details: undefined;
}