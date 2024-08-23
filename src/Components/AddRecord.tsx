import * as React from "react";
import Modal from "@cloudscape-design/components/modal";
import Button from "@cloudscape-design/components/button";
import {AddRecordProps} from "../Utils/Types";
import Form from "@cloudscape-design/components/form";
import SpaceBetween from "@cloudscape-design/components/space-between";
import FormField from "@cloudscape-design/components/form-field";
import Input from "@cloudscape-design/components/input";
import ButtonDropdown from "@cloudscape-design/components/button-dropdown";
import Textarea from "@cloudscape-design/components/textarea";
import {ANNOTATION_STATUS_OPTIONS, API_STATUS} from "../Config";
import {isAnnotationRecordValid, transformTagInput} from "../Utils/DataHandling";
import Alert from "@cloudscape-design/components/alert";
import {callApi} from "../Utils/CallApi";


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
        setUserName("")
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
            <Form actions={<Button onClick={() => addButtonPressed()}>Add</Button>}>
                <SpaceBetween size={'m'}>

                    <FormField label="User Name"  description="Annotation task owner">
                        <ButtonDropdown
                            items={props.allUsers}
                            onItemClick={(item) => setUserName(item.detail.id)}
                        >
                            {userName}
                        </ButtonDropdown>
                    </FormField>

                    <FormField label="Annotation Status">
                        <ButtonDropdown
                            items={ANNOTATION_STATUS_OPTIONS}
                            onItemClick={(item) => setAnnotationStatus(item.detail.id)}
                        >
                            {annotationStatus}
                        </ButtonDropdown>
                    </FormField>

                    <FormField label="Original un-annotated data" description="REQUIRED">
                        <Textarea
                            onChange={({ detail }) => setOriginalData(detail.value)}
                            value={originalData}
                        />
                    </FormField>

                    <FormField label="Annotated data">
                        <Textarea
                            onChange={({ detail }) => setAnnotatedData(detail.value)}
                            value={annotatedData}
                            disabled={annotationStatus !== "Completed"}
                        />
                    </FormField>

                    <FormField label="Tags" description="OPTIONAL. This should be in the form of a list (example: tag1, tag2), separate the tags with commas">
                        <Input onChange={({ detail }) => setTags(detail.value)} value={tags}/>
                    </FormField>

                </SpaceBetween>

                {apiStatus === API_STATUS.WAITING && <Alert>Waiting for API response. This sometimes can take a while if this is the first API call</Alert>}

                {error && <Alert
                    statusIconAriaLabel="Error"
                    type="error"
                >
                    Error: {error}
                </Alert>
                }

            </Form>
        </Modal>
    );
}
