export interface Message {
  id: string;
  threadId: string;
  labelIds: string[];
  snippet: string;
  historyId: string;
  internalDate: string;
  payload: MessagePart;
  sizeEstimate: number;
  raw: string;
}

export interface MessagePart {
  partId: string;
  mimeType: string;
  filename: string;
  headers: any[];
  body: MessagePartBody;
  parts: MessagePart[];
}

export interface MessagePartBody {
  attachmentId: string;
  size: number;
  data: string;
}
