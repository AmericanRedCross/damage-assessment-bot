
export default interface ChatPromptRequest {
    requestType: ChatPromptRequestType;
    chatAddress: any;
    args?: any
}

// Supporting types
export enum ChatPromptRequestType {
    PromptReport = "PromptReport"
}