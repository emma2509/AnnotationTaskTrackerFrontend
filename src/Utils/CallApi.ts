import {API_URL} from "../Config";

export interface ApiResponseFormat {
    statusCode: number,
    body: string
}

export async function callApi(requestBody: any, apiRoute: string, method: string): Promise<ApiResponseFormat> {
    let fullApiRequest;
    if (method === "GET"){
        fullApiRequest = {
            method: "GET",
            headers: {"Content-Type" : "application/json"},
        }
    } else {
        fullApiRequest = {
            method: method,
            body: JSON.stringify(requestBody),
            headers: {"Content-Type" : "application/json"},
        }
    }

    const apiResponse = await fetch(`${API_URL}/${apiRoute}`, fullApiRequest)
        .then(async (response) => {return await response.json()})
        .catch(error => {
            return {
                statusCode: 400,
                body: `Error with api call: ${error}`
            }
        });
    return apiResponse;
}
