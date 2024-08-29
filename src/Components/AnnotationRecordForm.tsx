import Form from "@cloudscape-design/components/form";
import Button from "@cloudscape-design/components/button";
import SpaceBetween from "@cloudscape-design/components/space-between";
import FormField from "@cloudscape-design/components/form-field";
import ButtonDropdown from "@cloudscape-design/components/button-dropdown";
import {ANNOTATION_STATUS_OPTIONS} from "../Config";
import Textarea from "@cloudscape-design/components/textarea";
import Input from "@cloudscape-design/components/input";
import * as React from "react";
import {AnnotationRecordFormProps} from "../Utils/Types";


// General component to show annotation record fields for when adding, updating and deleting records
export function AnnotationRecordForm (props: AnnotationRecordFormProps) {
    return (
        <Form actions={<Button onClick={() => props.buttonClick()}>
            {props.actionType}
        </Button>}>

            <SpaceBetween size={'m'}>

                <FormField label="User Name"  description="Annotation task owner">
                    <ButtonDropdown
                        items={props.allUsers}
                        onItemClick={(item) => props.setUserName(item.detail.id)}
                        disabled={props.actionType === "Delete"}
                    >
                        {props.userName}
                    </ButtonDropdown>
                </FormField>

                <FormField label="Annotation Status">
                    <ButtonDropdown
                        items={ANNOTATION_STATUS_OPTIONS}
                        onItemClick={(item) => props.setAnnotationStatus(item.detail.id)}
                        disabled={props.actionType === "Delete"}
                    >
                        {props.annotationStatus}
                    </ButtonDropdown>
                </FormField>

                <FormField label="Original un-annotated data" description="REQUIRED">
                    <Textarea
                        onChange={({ detail }) => props.setOriginalData(detail.value)}
                        value={props.originalData}
                        disabled={props.actionType === "Delete"}
                    />
                </FormField>

                <FormField label="Annotated data">
                    <Textarea
                        onChange={({ detail }) => props.setAnnotatedData(detail.value)}
                        value={props.annotatedData}
                        disabled={props.annotationStatus !== "Completed" || props.actionType === "Delete"}
                    />
                </FormField>

                <FormField label="Tags" description="OPTIONAL. This should be in the form of a list (example: tag1, tag2), separate the tags with commas">
                    <Input
                        onChange={({ detail }) => props.setTags(detail.value)}
                        value={props.tags}
                        disabled={props.actionType === "Delete"}
                    />
                </FormField>

            </SpaceBetween>

        </Form>

    )
}
