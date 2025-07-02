import { APIRequestContext } from "@playwright/test";

export default class APIClient{
    private request: APIRequestContext;
    private baseURL: string;

    constructor(request: APIRequestContext, baseURL: string) {
        this.request = request;
        this.baseURL = baseURL;
    }   

    async get(endpoint: string, token?: string) {
        return await this.invokeAPI('GET', endpoint, undefined, token);
    }

    async post(endpoint: string, requestBody?: object, token?: string) {
        return await this.invokeAPI('POST', endpoint, requestBody, token);
    }

    async put(endpoint: string, requestBody?: object, token?: string) {
        return await this.invokeAPI('PUT', endpoint, requestBody, token);
    }

    async patch(endpoint: string, requestBody?: object, token?: string) {
        return await this.invokeAPI('PATCH', endpoint, requestBody, token);
    }

    async delete(endpoint: string, token?: string) {
        return await this.invokeAPI('DELETE', endpoint, undefined, token);
    }

    private async invokeAPI(method: string, endpoint: string, requestBody?: object, token?: string) {
    const headers: Record<string, string> = token ? { Cookie: `token=${token}` } : {};
    const requestURL = endpoint ? this.baseURL.concat(endpoint) : this.baseURL;

    let response;
    switch (method.toUpperCase()) {
        case 'GET':
            response = await this.request.get(requestURL, { headers });
            break;
        case 'POST':
            response = await this.request.post(requestURL, { data: requestBody, headers });
            break;
        case 'PUT':
            response = await this.request.put(requestURL, { data: requestBody, headers });
            break;
        case 'PATCH':
            response = await this.request.patch(requestURL, { data: requestBody, headers });
            break;
        case 'DELETE':
            response = await this.request.delete(requestURL, { headers });
            break;
        default:
            throw new Error(`Unsupported HTTP method: ${method}`);
    }

    
    console.log(`Response: [${method.toUpperCase()}] ${response.url()}`);
    const contentType = response.headers()["content-type"];
    if (contentType?.includes("application/json")) {
        console.log(JSON.stringify(await response.json(), null, 2));
    } else {
        console.log(await response.text());
    }

    return response;
}


}