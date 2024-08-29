import {AnnotationRecordSearchProps, AnnotationTasks} from "../Utils/Types";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Input from "@cloudscape-design/components/input";
import Button from "@cloudscape-design/components/button";
import * as React from "react";
import {findRecord, transformDatabaseTag} from "../Utils/DataHandling";
import Alert from "@cloudscape-design/components/alert";
import Modal from "@cloudscape-design/components/modal";


export function AnnotationRecordSearch(props: AnnotationRecordSearchProps){
    const [error, setError] = React.useState<string>("");
    const [annotationId, setAnnotationId] = React.useState<string>("");

    function resetComponent() {
        setAnnotationId("")
        setError("")
        props.setVisible(false)
    }

    function findRecordButtonClick() {
        // get the original record values
        const record: AnnotationTasks | null = findRecord(props.allAnnotationRecords, annotationId)
        if (!record) {
            setError("No record with that id found.")
            return
        }
        record.tags = transformDatabaseTag(record.tags) // re-format format database form to user input format
        props.setAnnotationRecordFound(record)
        resetComponent()
    }


    return (
        <Modal
            onDismiss={() => resetComponent()}
            visible={props.visible}
            header={`${props.actionType} annotation record`}
        >
            <SpaceBetween size={'xs'}>
                <p>Enter the id of the annotation record you want to {props.actionType}:</p>
                <Input
                    onChange={({ detail }) => setAnnotationId(detail.value)}
                    value={annotationId}
                />
                <Button onClick={() => findRecordButtonClick()}>
                    {props.actionType}
                </Button>

                {error &&
                    <Alert
                        statusIconAriaLabel="Error"
                        type="error"
                    >
                        Error: {error}
                    </Alert>
                }

            </SpaceBetween>
        </Modal>
    )
}
