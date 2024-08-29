import Modal from "@cloudscape-design/components/modal";
import * as React from "react";
import {AnnotationTasks, DeleteRecordProps} from "../Utils/Types";
import {AnnotationRecordSearch} from "../Components/AnnotationRecordSearch";
import {API_METHODS, API_ROUTES, API_STATUS} from "../Config";
import {AnnotationRecordForm} from "../Components/AnnotationRecordForm";
import Alert from "@cloudscape-design/components/alert";
import {callApi} from "../Utils/CallApi";


export function DeleteRecord(props: DeleteRecordProps){
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

    return(
        <>
            <AnnotationRecordSearch
                visible={searchVisible}
                setVisible={setSearchVisible}
                allAnnotationRecords={props.allAnnotationRecords}
                setAnnotationRecordFound={setAnnotationRecord}
                actionType={"Delete"}
            />

            <Modal
                onDismiss={() => setFromVisible(false)}
                visible={formVisible}
                header="Are you sure you want to delete this record?"
            >
                <AnnotationRecordForm
                    actionType={"Delete"}
                    buttonClick={async() => await deleteRecord()}
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
                    allUsers={[]}
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
