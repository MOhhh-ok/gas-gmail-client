"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GmailClient = void 0;
class GmailClient {
    constructor(params) {
        var _a;
        this.token = params.token;
        this.userId = (_a = params.userId) !== null && _a !== void 0 ? _a : 'me';
    }
    getProfile() {
        const url = `https://gmail.googleapis.com/gmail/v1/users/${this.userId}/profile`;
        const res = this.getRequest(url);
        const data = JSON.parse(res.getContentText());
        return data;
    }
    getMessages(params) {
        const url = `https://gmail.googleapis.com/gmail/v1/users/${this.userId}/messages`;
        const res = this.getRequest(url, params);
        const data = JSON.parse(res.getContentText());
        return data;
    }
    getMessage(id) {
        const url = `https://gmail.googleapis.com/gmail/v1/users/${this.userId}/messages/${id}`;
        const res = this.getRequest(url);
        const data = JSON.parse(res.getContentText());
        return data;
    }
    messageToTexts(message) {
        const parts = this.getAllParts(message);
        return parts
            .map((part) => {
            var _a;
            const bodyData = (_a = part === null || part === void 0 ? void 0 : part.body) === null || _a === void 0 ? void 0 : _a.data;
            if (!bodyData)
                return null;
            const decodedData = Utilities.base64DecodeWebSafe(bodyData);
            const decodedDataString = Utilities.newBlob(decodedData).getDataAsString();
            return { mimeType: part.mimeType, body: decodedDataString };
        })
            .filter((text) => text !== null);
    }
    messageToSubject(message) {
        var _a, _b, _c;
        return (_c = (_b = (_a = message.payload) === null || _a === void 0 ? void 0 : _a.headers) === null || _b === void 0 ? void 0 : _b.find((header) => header.name === 'Subject')) === null || _c === void 0 ? void 0 : _c.value;
    }
    getAllParts(message) {
        var _a;
        const queue = [message.payload];
        const result = [];
        while (queue.length > 0) {
            const part = queue.shift();
            result.push(part);
            (_a = part === null || part === void 0 ? void 0 : part.parts) === null || _a === void 0 ? void 0 : _a.forEach((p) => queue.push(p));
        }
        return result;
    }
    getRequest(url, params) {
        if (!this.token) {
            throw new Error('Token is required');
        }
        const url2 = params ? `${url}?${this.paramsToQuery(params !== null && params !== void 0 ? params : {})}` : url;
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
        }
        catch (e) {
            console.error(e);
            throw e;
        }
    }
    paramsToQuery(params) {
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
exports.GmailClient = GmailClient;
