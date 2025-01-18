import { Message } from './types';
export declare class GmailClient {
    private readonly token;
    private readonly userId;
    constructor(params: {
        token: string;
        userId?: string;
    });
    getProfile(): {
        emailAddress: string;
        messagesTotal: number;
        threadsTotal: number;
        historyId: string;
    };
    getMessages(params: {
        maxResults?: number;
        pageToken?: string;
        q?: string;
        labelIds?: string[];
        includeSpamTrash?: boolean;
    }): {
        messages?: {
            id: string;
            threadId: string;
        }[];
        nextPageToken?: string;
        resultSizeEstimate: number;
    };
    getMessage(id: string): Message;
    parseMessage(message: Message): import("gmail-api-parse-message-ts").IEmail;
    messageToTexts(message: Message): {
        mimeType: string;
        body: string;
    }[];
    messageToSubject(message: Message): string | undefined;
    private getAllParts;
    private getRequest;
    private paramsToQuery;
}
