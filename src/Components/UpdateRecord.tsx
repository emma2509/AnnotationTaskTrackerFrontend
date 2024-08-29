import {AnnotationTasks, UpdateRecordProps} from "../Utils/Types";
import {isAnnotationRecordValid, transformTagInput} from "../Utils/DataHandling";
import Modal from "@cloudscape-design/components/modal";
import * as React from "react";
import Alert from "@cloudscape-design/components/alert";
import {AnnotationRecordForm} from "../Components/AnnotationRecordForm";
import {AnnotationRecordSearch} from "../Components/AnnotationRecordSearch";
import {API_METHODS, API_ROUTES, API_STATUS} from "../Config";
import {callApi} from "../Utils/CallApi";


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
        const apiCall = await callApi(newAnnotationRecord, API_ROUTES.UPDATE_ANNOTATION, API_METHODS.POST)
        if (apiCall.statusCode !== 200){
            setError(`Issue with API call, failed with message: ${apiCall.body}`)
            setApiStatus(API_STATUS.ERROR)
            return
        }
        setApiStatus(API_STATUS.SUCCESS)
        alert("Task successfully updated!")
        setFromVisible(false)
        props.setVisible(false); // hide whole element
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

    // watches visible prop and if try then show first element
    React.useEffect(() => {
        if (props.visible){
            setSearchVisible(true)
        }
    },[props.visible])

    return (
        <>
            <AnnotationRecordSearch
                visible={searchVisible}
                setVisible={setSearchVisible}
                allAnnotationRecords={props.annotationRecords}
                setAnnotationRecordFound={setAnnotationRecord}
                actionType={"Update"}
            />

            <Modal
                onDismiss={() => setFromVisible(false)}
                visible={formVisible}
                header="Updating annotation record"
            >
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
