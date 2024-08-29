import { API_METHODS, type API_ROUTES, API_URL } from '../Config';
import { type ApiResponseFormat } from './Types';

export async function callApi (requestBody: any, apiRoute: API_ROUTES, method: API_METHODS): Promise<ApiResponseFormat> {
    let fullApiRequest;
    if (method === API_METHODS.GET) {
        fullApiRequest = {
            method: API_METHODS.GET,
            headers: { 'Content-Type': 'application/json' }
        };
    } else {
        fullApiRequest = {
            method,
            body: JSON.stringify(requestBody),
            headers: { 'Content-Type': 'application/json' }
        };
    }

    const apiResponse = await fetch(`${API_URL}/${apiRoute}`, fullApiRequest)
        .then(async (response) => { return await response.json(); })
        .catch(error => {
            return {
                statusCode: 400,
                body: `Error with api call: ${error}`
            };
        });
    return apiResponse;
}
