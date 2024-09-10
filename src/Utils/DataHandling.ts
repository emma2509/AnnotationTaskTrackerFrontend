import { type AnnotationTasks, type ApiResponseFormat } from './Types';
import { type ButtonDropdownProps } from '@cloudscape-design/components';

export function formatAnnotationTaskApiResponse (apiResponse: ApiResponseFormat): AnnotationTasks[] | string {
    try {
        // loops through the 2D array returned and formats the records in the correct format for the table
        let recordIndex = 0;
        const formattedRecords = [];
        while (recordIndex < apiResponse.body.length) {
            const currentRecord = apiResponse.body[recordIndex];

            const formattedCurrentRecord = {
                id: currentRecord[0],
                userName: currentRecord[1],
                status: currentRecord[2],
                originalData: currentRecord[3],
                annotatedData: currentRecord[4],
                tags: currentRecord[5],
                firstName: currentRecord[6],
                lastName: currentRecord[7],
                team: currentRecord[8]
            };
            formattedRecords.push(formattedCurrentRecord);

            recordIndex++;
        }
        return formattedRecords;
    } catch (error) {
        return (error as Error).message;
    }
}

export function formatGetUsersApiResponse (apiResponse: ApiResponseFormat): readonly ButtonDropdownProps.Item[] | string {
    try {
        let index = 0;
        const formatted = [];
        while (index < apiResponse.body.length) {
            const current = apiResponse.body[index];

            const currentFormatted = {
                id: current[0],
                text: current[0]
            };
            formatted.push(currentFormatted);

            index++;
        }
        return formatted;
    } catch (error) {
        return (error as Error).message;
    }
}

export function isAnnotationRecordValid (
    userName: string,
    annotationStatus: string,
    originalData: string,
    annotatedData: string,
    tags: string
): boolean {
    // check if not annotations been added
    if (originalData === '') {
        return false;
    }
    // check if there is no annotated data that should be there
    if (annotatedData === '' && annotationStatus === 'Completed') {
        return false;
    }
    return true;
}

// this converts the inputted list to the input expected by the database
export function transformTagInput (tags: string) {
    let convertedTagList: any = tags.split(',');
    convertedTagList = convertedTagList.map((tag: string) => `"${tag.trim()}"`);
    convertedTagList = `[${convertedTagList.join(',')}]`;
    return convertedTagList;
}

// this takes the database format and converts to the input list format
export function transformDatabaseTag (tag: string) {
    let convertedTagList: string = tag;
    // replace quotes
    convertedTagList = convertedTagList.replaceAll('"', '');

    // replace array brackets
    convertedTagList = convertedTagList.replaceAll('[', '');
    convertedTagList = convertedTagList.replaceAll(']', '');
    return convertedTagList;
}

export function findRecord (annotationRecords: AnnotationTasks[], annotationId: string) {
    // loop through all records to find one with the same id
    for (const index in annotationRecords) {
        if (String(annotationRecords[index].id) === annotationId) {
            return annotationRecords[index];
        }
    }
    return null;
}
