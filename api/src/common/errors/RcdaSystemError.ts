import RcdaError, { RcdaErrorTypes } from "@/common/errors/RcdaError";

export default class RcdaSystemError extends RcdaError {
    public typeId = RcdaErrorTypes.SystemError;
    details: undefined;
}