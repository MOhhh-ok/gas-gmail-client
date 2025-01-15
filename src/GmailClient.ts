import { Message } from './types';

export class GmailClient {
  constructor(
    private readonly token: string,
    private readonly userId: string = 'me'
  ) {}

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
      messages: { id: string; threadId: string }[];
      nextPageToken: string;
      resultSizeEstimate: number;
    } = JSON.parse(res.getContentText());
    return data;
  }

  getMessage(id: string) {
    const url = `https://gmail.googleapis.com/gmail/v1/users/${this.userId}/messages/${id}`;
    const res = this.getRequest(url);
    const data: Message = JSON.parse(res.getContentText());
    console.log({ data });
    const body = data.payload.body;
    console.log({ body });
    const bodyData = body.data;
    console.log({ bodyData });
    const decodedData = Utilities.base64Decode(bodyData);
    console.log({ decodedData });
    const decodedDataString = Utilities.base64Decode(bodyData).toString();
    console.log({ decodedDataString });
    data.payload.body.data = decodedDataString;
    return data;
  }

  private getRequest(url: string, params?: any) {
    const url2 = `${url}?${this.paramsToQuery(params ?? {})}`;
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
