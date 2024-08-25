import {AnnotationTasks, UpdateRecordProps} from "../Utils/Types";
import {findRecord, isAnnotationRecordValid, transformDatabaseTag, transformTagInput} from "../Utils/DataHandling";
import Modal from "@cloudscape-design/components/modal";
import Input from "@cloudscape-design/components/input";
import Button from "@cloudscape-design/components/button";
import SpaceBetween from "@cloudscape-design/components/space-between";
import * as React from "react";
import Alert from "@cloudscape-design/components/alert";
import {AnnotationRecordForm} from "../Components/AnnotationRecordForm";
import {API_STATUS} from "../Config";
import {callApi} from "../Utils/CallApi";


export function UpdateRecord (props: UpdateRecordProps) {
    const [userName, setUserName] = React.useState<string>("");
    const [annotationStatus, setAnnotationStatus] = React.useState<string>("");
    const [originalData, setOriginalData] = React.useState<string>("");
    const [annotatedData, setAnnotatedData] = React.useState<string>("");
    const [tags, setTags] = React.useState<string>("");
    const [annotationId, setAnnotationId] = React.useState<string>("");
    const [error, setError] = React.useState<string>("");
    const [viewToShow, setViewToShow] = React.useState<string>("id");
    const [apiStatus, setApiStatus] = React.useState<API_STATUS>(API_STATUS.NONE);

    // sets back to default when user exists the pop up
    function reset(){
        props.setVisible(false)
        setViewToShow("id")
        setAnnotationId("")
    }

    async function updateButton(){
        // checks inputs
        if (!isAnnotationRecordValid(userName, annotationStatus, originalData, annotatedData, tags)){
            setError("Incorrect inputs")
            return
        }

        // api call - send all current fields
        const newAnnotationRecord = {
            "annotation-id": annotationId,
            "user-name": userName,
            "annotation-status": annotationStatus,
            "original-data": originalData,
            "annotated-data": annotatedData,
            "tags": transformTagInput(tags)
        }
        setApiStatus(API_STATUS.WAITING)
        const apiCall = await callApi(newAnnotationRecord, "update_annotation", "POST")
        if (apiCall.statusCode !== 200){
            setError(`Issue with API call, failed with message: ${apiCall.body}`)
            setApiStatus(API_STATUS.ERROR)
            return
        }
        setApiStatus(API_STATUS.SUCCESS)
        alert("Task successfully updated!")
        reset()
    }

    function findRecordButtonClick() {
        setError("") // clear errors
        // get the original record values
        const record: AnnotationTasks | null = findRecord(props.annotationRecords, annotationId)
        if (!record) {
            setError("No record with that id found.")
            return
        }
        // set values in record form to be the original record values
        setUserName(record.userName)
        setAnnotationStatus(record.status)
        setOriginalData(record.originalData)
        setAnnotatedData(record.annotatedData)
        setTags(transformDatabaseTag(record.tags)) // re-format format database form to user input format

        // show the form and close the find annotation id search
        setViewToShow("form")

    }

    return (
        <Modal
            onDismiss={() => reset()}
            visible={props.visible}
            header="Updating annotation record"
        >
            {viewToShow === "id" &&
                <SpaceBetween size={'xs'}>
                    Enter the id of the annotation record you want to update:
                    <Input
                        onChange={({ detail }) => setAnnotationId(detail.value)}
                        value={annotationId}
                    />
                    <Button onClick={() => findRecordButtonClick()}>
                        Find annotation record
                    </Button>
                </SpaceBetween>
            }

            {viewToShow === "form" &&
                <AnnotationRecordForm
                    actionType={"Update"}
                    buttonClick={updateButton}
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
            }

            {apiStatus === API_STATUS.WAITING && <Alert>Waiting for API response. This sometimes can take a while if this is the first API call</Alert>}

            {error &&
                <Alert
                    statusIconAriaLabel="Error"
                    type="error"
                >
                Error: {error}
                </Alert>
            }

        </Modal>
    )
}
