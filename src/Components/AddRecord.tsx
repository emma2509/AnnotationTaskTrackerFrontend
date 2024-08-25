import * as React from "react";
import Modal from "@cloudscape-design/components/modal";
import {AddRecordProps} from "../Utils/Types";
import {ANNOTATION_STATUS_OPTIONS, API_STATUS} from "../Config";
import {isAnnotationRecordValid, transformTagInput} from "../Utils/DataHandling";
import Alert from "@cloudscape-design/components/alert";
import {callApi} from "../Utils/CallApi";
import {AnnotationRecordForm} from "../Components/AnnotationRecordForm";


export function AddRecord(props: AddRecordProps){
    const [userName, setUserName] = React.useState<string>(props.allUsers[0].id);
    const [annotationStatus, setAnnotationStatus] = React.useState<string>(ANNOTATION_STATUS_OPTIONS[0].id);
    const [originalData, setOriginalData] = React.useState<string>("");
    const [annotatedData, setAnnotatedData] = React.useState<string>("");
    const [tags, setTags] = React.useState<string>("");

    const [apiStatus, setApiStatus] = React.useState<API_STATUS>(API_STATUS.NONE);
    const [error, setError] = React.useState<undefined | string>(undefined);

    async function addButtonPressed() {
        // checks inputs
        if (!isAnnotationRecordValid(userName, annotationStatus, originalData, annotatedData, tags)){
            setError("Incorrect inputs")
            return
        }

        // api call
        const annotationFields = {
            "user-name": userName,
            "annotation-status": annotationStatus,
            "original-data": originalData,
            "annotated-data": annotatedData,
            "tags": transformTagInput(tags)
        }
        setApiStatus(API_STATUS.WAITING)
        const addRecordCall = await callApi(annotationFields, "add_annotation", "POST")
        if (addRecordCall.statusCode !== 200){
            setError(`Issue with API call, failed with message: ${addRecordCall.body}`)
            setApiStatus(API_STATUS.ERROR)
            return
        }
        setApiStatus(API_STATUS.SUCCESS)
        alert("Task successfully added!")
        props.setVisible(false)

        // reset string inputs to be empty
        setUserName(props.allUsers[0].id)
        setOriginalData("")
        setAnnotatedData("")
        setTags("")
    }

    return (
        <Modal
            onDismiss={() => props.setVisible(false)}
            visible={props.visible}
            header="Enter the annotation task details"
        >
            <AnnotationRecordForm
                actionType={"Add"}
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

            />

            {apiStatus === API_STATUS.WAITING && <Alert>Waiting for API response. This sometimes can take a while if this is the first API call</Alert>}

            {error && <Alert
                statusIconAriaLabel="Error"
                type="error"
            >
                Error: {error}
            </Alert>
            }

        </Modal>
    );
}
