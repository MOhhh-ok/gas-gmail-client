"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GmailClient = void 0;
class GmailClient {
    constructor(token, userId = 'me') {
        this.token = token;
        this.userId = userId;
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
    getRequest(url, params) {
        const url2 = `${url}?${this.paramsToQuery(params !== null && params !== void 0 ? params : {})}`;
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
