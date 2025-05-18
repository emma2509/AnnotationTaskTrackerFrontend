import { API_METHODS, type API_ROUTES, API_URL } from "../Config";
import { type ApiResponseFormat } from "./Types";

export async function callApi(
    requestBody: { [key: string]: any } ,
    apiRoute: API_ROUTES,
    method: API_METHODS,
    userName: string,
    password: string
): Promise<ApiResponseFormat> {
    const apiHeader = {
        "Content-Type": "application/json",
        "requester-user-name": userName,
        "requester-password": password,
    }
    let fullApiRequest;
    if (method === API_METHODS.GET) {
        fullApiRequest = {
            method: API_METHODS.GET,
            headers: apiHeader,
        };
    } else {
        fullApiRequest = {
            method,
            body: JSON.stringify(requestBody),
            headers: apiHeader,
        };
    }

    const apiResponse = await fetch(`${API_URL}/${apiRoute}`, fullApiRequest)
        .then(async (response) => {
            return await response.json();
        })
        .catch((error) => {
            return {
                statusCode: 400,
                body: `Error with api call: ${error}`,
            };
        });
    return apiResponse;
}
