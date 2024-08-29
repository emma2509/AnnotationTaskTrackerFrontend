import * as React from 'react';
import { type AddRecordProps } from '../Utils/Types';
import { ACTION_TYPES, ANNOTATION_STATUS_OPTIONS, API_METHODS, API_ROUTES, API_STATUS } from '../Config';
import { isAnnotationRecordValid, transformTagInput } from '../Utils/DataHandling';
import { callApi } from '../Utils/CallApi';
import { AnnotationRecordForm } from '../Components/AnnotationRecordForm';

export function AddRecord (props: AddRecordProps) {
    const [userName, setUserName] = React.useState<string>(props.allUsers[0].id);
    const [annotationStatus, setAnnotationStatus] = React.useState<string>(ANNOTATION_STATUS_OPTIONS[0].id);
    const [originalData, setOriginalData] = React.useState<string>('');
    const [annotatedData, setAnnotatedData] = React.useState<string>('');
    const [tags, setTags] = React.useState<string>('');

    const [apiStatus, setApiStatus] = React.useState<API_STATUS>(API_STATUS.NONE);
    const [error, setError] = React.useState<undefined | string>(undefined);

    function resetComponent () {
        props.setVisible(false);

        // reset string inputs to be empty
        setUserName(props.allUsers[0].id);
        setOriginalData('');
        setAnnotatedData('');
        setTags('');
    }

    async function addButtonPressed () {
        // checks inputs
        if (!isAnnotationRecordValid(userName, annotationStatus, originalData, annotatedData, tags)) {
            setError('Incorrect inputs');
            return;
        }

        // api call
        const annotationFields = {
            'user-name': userName,
            'annotation-status': annotationStatus,
            'original-data': originalData,
            'annotated-data': annotatedData,
            tags: transformTagInput(tags)
        };
        setApiStatus(API_STATUS.WAITING);
        const addRecordCall = await callApi(annotationFields, API_ROUTES.ADD_ANNOTATION, API_METHODS.POST);
        if (addRecordCall.statusCode !== 200) {
            setError(`Issue with API call, failed with message: ${addRecordCall.body}`);
            setApiStatus(API_STATUS.ERROR);
            return;
        }
        setApiStatus(API_STATUS.SUCCESS);
        alert('Task successfully added!');

        resetComponent();
    }

    return (
        <AnnotationRecordForm
            actionType={ACTION_TYPES.ADD}
            buttonClick={addButtonPressed}
            userName={userName}
            setUserName={setUserName}
            annotationStatus={annotationStatus}
            setAnnotationStatus={setAnnotationStatus}
            originalData={originalData}
            setOriginalData={setOriginalData}
            annotatedData={annotatedData}
            setAnnotatedData={setAnnotatedData}
            tags={tags}
            setTags={setTags}
            allUsers={props.allUsers}
            error={error}
            apiStatus={apiStatus}
            visible={props.visible}
            setVisible={props.setVisible}
        />
    );
}
