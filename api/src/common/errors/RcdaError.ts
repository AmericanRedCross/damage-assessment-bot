export const enum RcdaErrorTypes {
    ClientError = "ClientError",
    SystemError = "SystemError"
};

export default abstract class RcdaError extends Error {
    abstract typeId: RcdaErrorTypes;
    abstract details?: any;
}
