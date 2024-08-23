import {AnnotationTasks, ApiResponseFormat} from "./Types";
import {ButtonDropdownProps} from "@cloudscape-design/components";


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


export function formatGetUsersApiResponse(apiResponse: ApiResponseFormat): ReadonlyArray<ButtonDropdownProps.Item> | string {
    try {
        let index = 0
        const formatted = []
        while (index < apiResponse.body.length){
            const current = apiResponse.body[index]

            const currentFormatted = {
                id: current[0],
                text: current[0],
            }
            formatted.push(currentFormatted)

            index++
        }
        return formatted;
    } catch (error){
        return (error as Error).message;
    }
}


export function isAnnotationRecordValid(
    userName: string,
    annotationStatus: string,
    originalData: string,
    annotatedData: string,
    tags: string
): boolean {
    // check if not annotations been added
    if (originalData === ""){
        return false
    }
    // check if there is no annotated data that should be there
    if (annotatedData === "" && annotationStatus === "Completed"){
        return false
    }
    return true
}


export function transformTagInput(tags: string) {
    let convertedTagList: any = tags.split(",")
    convertedTagList = convertedTagList.map((tag: string) => `"${tag.trim()}"`)
    convertedTagList = `[${convertedTagList.join(',')}]`
    return convertedTagList
}
