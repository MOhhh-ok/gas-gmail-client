import { Message } from './types';

export class GmailClient {
  private readonly token: string;
  private readonly userId: string;
  constructor(params: { token: string; userId?: string }) {
    this.token = params.token;
    this.userId = params.userId ?? 'me';
  }

  getProfile() {
    const url = `https://gmail.googleapis.com/gmail/v1/users/${this.userId}/profile`;
    const res = this.getRequest(url);
    const data: {
      emailAddress: string;
      messagesTotal: number;
      threadsTotal: number;
      historyId: string;
    } = JSON.parse(res.getContentText());
    return data;
  }

  getMessages(params: {
    maxResults?: number;
    pageToken?: string;
    q?: string;
    labelIds?: string[];
    includeSpamTrash?: boolean;
  }) {
    const url = `https://gmail.googleapis.com/gmail/v1/users/${this.userId}/messages`;
    const res = this.getRequest(url, params);
    const data: {
      messages?: { id: string; threadId: string }[];
      nextPageToken?: string;
      resultSizeEstimate: number;
    } = JSON.parse(res.getContentText());
    return data;
  }

  getMessage(id: string) {
    const url = `https://gmail.googleapis.com/gmail/v1/users/${this.userId}/messages/${id}`;
    const res = this.getRequest(url);
    const data: Message = JSON.parse(res.getContentText());
    return data;
  }

  messageToTexts(message: Message): { mimeType: string; body: string }[] {
    const parts = this.getAllParts(message);
    return parts
      .map((part) => {
        const bodyData = part?.body?.data;
        if (!bodyData) return null;
        const decodedData = Utilities.base64DecodeWebSafe(bodyData);
        const decodedDataString =
          Utilities.newBlob(decodedData).getDataAsString();
        return { mimeType: part.mimeType, body: decodedDataString };
      })
      .filter((text) => text !== null);
  }

  messageToSubject(message: Message) {
    return message.payload?.headers?.find((header) => header.name === 'Subject')
      ?.value;
  }

  private getAllParts(message: Message) {
    const queue = [message.payload];
    const result = [];
    while (queue.length > 0) {
      const part = queue.shift();
      result.push(part);
      part?.parts?.forEach((p) => queue.push(p));
    }
    return result;
  }

  private getRequest(url: string, params?: any) {
    if (!this.token) {
      throw new Error('Token is required');
    }
    const url2 = params ? `${url}?${this.paramsToQuery(params ?? {})}` : url;
    console.log('get', url2);
    const headers = {
      Authorization: `Bearer ${this.token}`,
    };
    try {
      const response = UrlFetchApp.fetch(url2, {
        headers: headers,
        method: 'get',
        muteHttpExceptions: true,
      });
      return response;
    } catch (e: any) {
      console.error(e);
      throw e;
    }
  }

  private paramsToQuery(
    params: Record<string, string | number | boolean | string[]>
  ) {
    return Object.entries(params)
      .map(([key, value]) => {
        if (typeof value === 'boolean') {
          return `${key}=${value ? 'true' : 'false'}`;
        }
        if (Array.isArray(value)) {
          return value.map((v) => `${encodeURIComponent(v)}`).join(',');
        }
        return `${key}=${encodeURIComponent(value)}`;
      })
      .join('&');
  }
}
