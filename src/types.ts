export interface Header {
  name:
    | 'Delivered-To'
    | 'Received'
    | 'X-Received'
    | 'ARC-Seal'
    | 'ARC-Message-Signature'
    | 'ARC-Authentication-Results'
    | 'Return-Path'
    | 'Received-SPF'
    | 'Authentication-Results'
    | 'DKIM-Signature'
    | 'X-Google-DKIM-Signature'
    | 'X-Gm-Message-State'
    | 'X-Google-Smtp-Source'
    | 'MIME-Version'
    | 'Date'
    | 'Reply-To'
    | 'X-Google-Id'
    | 'Feedback-ID'
    | 'X-Notifications'
    | 'X-Notifications-Bounce-Info'
    | 'Message-ID'
    | 'Subject'
    | 'From'
    | 'To'
    | 'Content-Type';
  value: string;
}

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
  headers: Header[];
  body: MessagePartBody;
  parts: MessagePart[];
}

export interface MessagePartBody {
  attachmentId: string;
  size: number;
  data: string;
}
