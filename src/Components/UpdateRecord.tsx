import {AnnotationTasks, UpdateRecordCompHeaderProps, UpdateRecordProps} from "../Utils/Types";
import {isAnnotationRecordValid, transformTagInput} from "../Utils/DataHandling";
import Modal from "@cloudscape-design/components/modal";
import * as React from "react";
import Alert from "@cloudscape-design/components/alert";
import {AnnotationRecordForm} from "../Components/AnnotationRecordForm";
import {AnnotationRecordSearch} from "../Components/AnnotationRecordSearch";
import {API_METHODS, API_ROUTES, API_STATUS} from "../Config";
import {callApi} from "../Utils/CallApi";


// Component for updating annotation task - this includes updating the record fields or deleting the record.
export function UpdateRecord (props: UpdateRecordProps) {
    const [annotationRecord, setAnnotationRecord] = React.useState<AnnotationTasks | undefined>(undefined);
    const [userName, setUserName] = React.useState<string>("");
    const [annotationStatus, setAnnotationStatus] = React.useState<string>("");
    const [originalData, setOriginalData] = React.useState<string>("");
    const [annotatedData, setAnnotatedData] = React.useState<string>("");
    const [tags, setTags] = React.useState<string>("");
    const [annotationId, setAnnotationId] = React.useState<string>("");
    const [error, setError] = React.useState<string>("");
    const [apiStatus, setApiStatus] = React.useState<API_STATUS>(API_STATUS.NONE);

    // visible components
    const [formVisible, setFromVisible] = React.useState<boolean>(false);
    const [searchVisible, setSearchVisible] = React.useState<boolean>(false);

    const header: UpdateRecordCompHeaderProps = {
        "Delete": "Are you sure you want to delete this record?",
        "Update": "Updating annotation record"
    }

    function resetComponent(){
        // done with feature, reset and hide
        setFromVisible(false)
        setSearchVisible(false)
        setError("")
    }

    async function updateButton() {
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
        const apiCall = await callApi(newAnnotationRecord, API_ROUTES.UPDATE_ANNOTATION, API_METHODS.POST)
        if (apiCall.statusCode !== 200){
            setError(`Issue with API call, failed with message: ${apiCall.body}`)
            setApiStatus(API_STATUS.ERROR)
            return
        }
        setApiStatus(API_STATUS.SUCCESS)
        alert("Task successfully updated!")

        resetComponent()
    }

    async function deleteRecord(){
        setApiStatus(API_STATUS.WAITING)
        const apiCall = await callApi({"annotation-id": annotationId}, API_ROUTES.DELETE_ANNOTATION, API_METHODS.POST)
        if (apiCall.statusCode !== 200){
            setError(`Issue with API call, failed with message: ${apiCall.body}`)
            setApiStatus(API_STATUS.ERROR)
            return
        }
        setApiStatus(API_STATUS.SUCCESS)
        alert("Task successfully deleted")

        resetComponent()
    }

    // watch annotation record and if updated and not null then a new record is being updated so need to change to form view
    React.useEffect(() => {
            if (annotationRecord) {
                // change view to form
                setFromVisible(true)

                // set all field values
                setUserName(annotationRecord.userName)
                setAnnotationStatus(annotationRecord.status)
                setOriginalData(annotationRecord.originalData)
                setAnnotatedData(annotationRecord.annotatedData)
                setTags(annotationRecord.tags)
                setAnnotationId(annotationRecord.id)
            }
        },
        [annotationRecord])

    // watches visible prop and if true then show first element
    React.useEffect(() => {
        if (props.visible){
            setSearchVisible(true)
        }
    },[props.visible])

    // follow the components is visible
    React.useEffect(() => {
        // if both hidden then done with this whole component
        if (!searchVisible && !formVisible) {
            props.setVisible(false)
        }
        // if one or both are true then still using this component
        if (formVisible || searchVisible){
            props.setVisible(true)
        }
    }, [searchVisible, formVisible])

    return (
        <>
            <AnnotationRecordSearch
                visible={searchVisible}
                setVisible={setSearchVisible}
                allAnnotationRecords={props.annotationRecords}
                setAnnotationRecordFound={setAnnotationRecord}
                actionType={props.actionType}
            />

            <Modal
                onDismiss={() => setFromVisible(false)}
                visible={formVisible}
                header={header[props.actionType]}
            >
                <AnnotationRecordForm
                    actionType={props.actionType}
                    buttonClick={props.actionType === "Update"
                        ? updateButton
                        : deleteRecord
                }
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

                {apiStatus === API_STATUS.WAITING &&
                    <Alert>Waiting for API response. This sometimes can take a while if this is the first API call</Alert>}

                {error &&
                    <Alert
                        statusIconAriaLabel="Error"
                        type="error"
                    >
                        Error: {error}
                    </Alert>}

            </Modal>
        </>
    )
}
