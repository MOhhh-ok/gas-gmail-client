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
        messages: {
            id: string;
            threadId: string;
        }[];
        nextPageToken: string;
        resultSizeEstimate: number;
    };
    getMessage(id: string): Message;
    messageToTexts(message: Message): {
        mimeType: string;
        body: string;
    }[];
    private getAllParts;
    private getRequest;
    private paramsToQuery;
}
