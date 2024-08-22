import {API_URL} from "../Config";

interface ApiResponseFormat {
    statusCode: number,
    body: string
}

export async function callApi(requestBody: any, apiRoute: string, method: string): Promise<ApiResponseFormat> {
    const apiResponse = await fetch(`${API_URL}/${apiRoute}`,
        {
            method: method,
            body: JSON.stringify(requestBody),
            headers: {"Content-Type" : "application/json"},
        }
    )
        .then(async (response) => {return await response.json()})
        .catch(error => {
            return {
                statusCode: 400,
                body: `Error with api call: ${error}`
            }
        });
    return apiResponse;
}
