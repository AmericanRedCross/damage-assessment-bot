export enum RcdaErrorTypes {
    ClientError = "ClientError",
    SystemError = "SystemError"
};

export default class RcdaError<TDetails> extends Error {

    constructor(typeId: RcdaErrorTypes.ClientError, message: string);
    constructor(typeId: RcdaErrorTypes.SystemError, message: string);
    constructor(typeId: RcdaErrorTypes, message: string, details?: any) {
        super(message);
        this.message = message;
        this.typeId = typeId;
        this.details = details;
    }

    typeId: RcdaErrorTypes;
    details?: TDetails;
}