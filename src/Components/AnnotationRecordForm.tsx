import Form from "@cloudscape-design/components/form";
import Button from "@cloudscape-design/components/button";
import SpaceBetween from "@cloudscape-design/components/space-between";
import FormField from "@cloudscape-design/components/form-field";
import ButtonDropdown from "@cloudscape-design/components/button-dropdown";
import Modal from "@cloudscape-design/components/modal";
import {
    ACTION_TYPES,
    ANNOTATION_STATUS_OPTIONS,
    API_METHODS,
    API_ROUTES,
    API_STATUS,
} from "../Config";
import Textarea from "@cloudscape-design/components/textarea";
import Input from "@cloudscape-design/components/input";
import * as React from "react";
import { AnnotationRecordFormProps } from "../Utils/Types";
import { ErrorMessage } from "../Components/ErrorMessage";
import { WaitMessage } from "../Components/WaitMessage";
import {
    isAnnotationRecordValid,
    transformTagInput,
} from "../Utils/DataHandling";
import { callApi } from "../Utils/CallApi";

// Components used to add, update and delete annotation records
export function AnnotationRecordForm(props: AnnotationRecordFormProps) {
    const header: { [key in ACTION_TYPES]: string } = {
        [ACTION_TYPES.DELETE]: "Are you sure you want to delete this record?",
        [ACTION_TYPES.UPDATE]: "Updating annotation record",
        [ACTION_TYPES.ADD]: "Enter the annotation task details",
    };
    const [userName, setUserName] = React.useState<string>("");
    const [annotationStatus, setAnnotationStatus] = React.useState<string>("");
    const [originalData, setOriginalData] = React.useState<string>("");
    const [annotatedData, setAnnotatedData] = React.useState<string>("");
    const [tags, setTags] = React.useState<string>("");
    const [annotationId, setAnnotationId] = React.useState<string>("");
    const [error, setError] = React.useState<string>("");
    const [apiStatus, setApiStatus] = React.useState<API_STATUS>(
        API_STATUS.NONE,
    );

    // Re-load values to use most up-to-date ones
    React.useEffect(() => {
        setUserName(props.annotationRecord.userName);
        setAnnotationStatus(props.annotationRecord.status);
        setOriginalData(props.annotationRecord.originalData);
        setAnnotatedData(props.annotationRecord.annotatedData);
        setTags(props.annotationRecord.tags);
        setAnnotationId(props.annotationRecord.id);
    }, [props.annotationRecord]);

    async function actionButton() {
        // checks inputs and set error if incorrect input
        if (
            props.actionType === ACTION_TYPES.UPDATE ||
            props.actionType === ACTION_TYPES.ADD
        ) {
            if (
                !isAnnotationRecordValid(
                    annotationStatus,
                    originalData,
                    annotatedData,
                )
            ) {
                setError(
                    "Incorrect inputs, please check the fields above for any issues.",
                );
                return;
            }
        }
        setError("");

        // api call
        let apiBody;
        let apiRoute: API_ROUTES = API_ROUTES.ADD_ANNOTATION;
        if (props.actionType === ACTION_TYPES.ADD) {
            apiBody = {
                "user-name": userName,
                "annotation-status": annotationStatus,
                "original-data": originalData,
                "annotated-data": annotatedData,
                tags: transformTagInput(tags),
            };
            apiRoute = API_ROUTES.ADD_ANNOTATION;
        } else if (props.actionType === ACTION_TYPES.UPDATE) {
            apiBody = {
                "annotation-id": annotationId,
                "user-name": userName,
                "annotation-status": annotationStatus,
                "original-data": originalData,
                "annotated-data": annotatedData,
                tags: transformTagInput(tags),
            };
            apiRoute = API_ROUTES.UPDATE_ANNOTATION;
        } else if (props.actionType === ACTION_TYPES.DELETE) {
            apiBody = { "annotation-id": annotationId };
            apiRoute = API_ROUTES.DELETE_ANNOTATION;
        }

        setApiStatus(API_STATUS.WAITING);
        console.log(apiBody, apiRoute);
        const apiCall = await callApi(apiBody, apiRoute, API_METHODS.POST);
        if (apiCall.statusCode !== 200) {
            setError(
                `Issue with API call, failed with message: ${apiCall.body}`,
            );
            setApiStatus(API_STATUS.ERROR);
            return;
        }
        setApiStatus(API_STATUS.SUCCESS);
        alert(`${props.actionType} successful!`);
        props.setVisible(false);
    }

    return (
        <Modal
            onDismiss={() => {
                props.setVisible(false);
            }}
            visible={props.visible}
            header={header[props.actionType]}
        >
            <Form
                actions={
                    <Button onClick={() => actionButton()}>
                        {props.actionType}
                    </Button>
                }
            >
                <SpaceBetween size={"m"}>
                    <FormField
                        label="User Name"
                        description="Annotation task owner"
                    >
                        <ButtonDropdown
                            items={props.allUsers}
                            onItemClick={(item) => {
                                setUserName(item.detail.id);
                            }}
                            disabled={props.actionType === ACTION_TYPES.DELETE}
                        >
                            {userName}
                        </ButtonDropdown>
                    </FormField>

                    <FormField label="Annotation Status">
                        <ButtonDropdown
                            items={ANNOTATION_STATUS_OPTIONS}
                            onItemClick={(item) => {
                                setAnnotationStatus(item.detail.id);
                                if (item.detail.id !== "Completed") {
                                    setAnnotatedData("");
                                }
                            }}
                            disabled={props.actionType === ACTION_TYPES.DELETE}
                        >
                            {annotationStatus}
                        </ButtonDropdown>
                    </FormField>

                    <FormField
                        label="Original un-annotated data"
                        description="REQUIRED"
                    >
                        <Textarea
                            onChange={({ detail }) => {
                                setOriginalData(detail.value);
                            }}
                            value={originalData}
                            disabled={props.actionType === ACTION_TYPES.DELETE}
                            invalid={originalData === ""}
                        />
                    </FormField>

                    <FormField
                        label="Annotated data"
                        description="Only required if annotation is completed."
                    >
                        <Textarea
                            onChange={({ detail }) => {
                                setAnnotatedData(detail.value);
                            }}
                            value={annotatedData}
                            disabled={
                                annotationStatus !== "Completed" ||
                                props.actionType === ACTION_TYPES.DELETE
                            }
                            invalid={
                                annotationStatus === "Completed" &&
                                annotatedData === ""
                            }
                        />
                    </FormField>

                    <FormField
                        label="Tags"
                        description="OPTIONAL. This should be in the form of a list (example: tag1, tag2), separate the tags with commas"
                    >
                        <Input
                            onChange={({ detail }) => {
                                setTags(detail.value);
                            }}
                            value={tags}
                            disabled={props.actionType === ACTION_TYPES.DELETE}
                        />
                    </FormField>
                </SpaceBetween>
            </Form>

            <WaitMessage apiStatus={apiStatus} />
            <ErrorMessage errorMessage={error} />
        </Modal>
    );
}
