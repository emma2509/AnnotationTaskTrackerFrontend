import {API_URL} from "../config";

export async function callApi(requestBody: any, apiRoute: string, method: string): Promise<any> {
    const apiResponse = await fetch(`${API_URL}/${apiRoute}`,
        {
            method: method,
            body: JSON.stringify(requestBody),
            headers: {"Content-Type" : "application/json"},
        }
    )
        .then(async (response) => {return await response.json()})
        .catch(error => error);
    return apiResponse;
}
