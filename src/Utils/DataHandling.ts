import {AnnotationTasks, ApiResponseFormat} from "./Types";


export function formatAnnotationTaskApiResponse(apiResponse: ApiResponseFormat): AnnotationTasks[] | string {
    try {
        // loops through the 2D array returned and formats the records in the correct format for the table
        let recordIndex = 0
        const formattedRecords = []
        while (recordIndex < apiResponse.body.length){
            const currentRecord = apiResponse.body[recordIndex]

            const formattedCurrentRecord = {
                id: currentRecord[0],
                userName: currentRecord[1],
                status: currentRecord[2],
                originalData: currentRecord[3],
                annotatedData: currentRecord[4],
                tags: currentRecord[5],
            }
            formattedRecords.push(formattedCurrentRecord)

            recordIndex++
        }
        return formattedRecords;
    } catch (error){
        return (error as Error).message;
    }
}
