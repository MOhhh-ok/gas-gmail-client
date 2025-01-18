# GAS Gmail Client

This is a client for Gmail in GAS.

## Install

```
npm i @masa-dev/gas-gmail-client
```

## Basic Usage

```typescript
const client = new GmailClient({ token });
const messageList = client.getMessages({ q: 'from:' + fromMail });
if (!messageList.messages) throw new Error('No messages found');
const message = client.getMessage(messageList.messages[0].id);
const parsed = client.parseMessage(message);
```

## License

MIT
