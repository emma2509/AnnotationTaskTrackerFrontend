import {AnnotationTasks, UpdateRecordProps} from "../Utils/Types";
import {findRecord} from "../Utils/DataHandling";
import Modal from "@cloudscape-design/components/modal";
import Input from "@cloudscape-design/components/input";
import Button from "@cloudscape-design/components/button";
import * as React from "react";
import Alert from "@cloudscape-design/components/alert";


export function UpdateRecord (props: UpdateRecordProps) {
    const [annotationId, setAnnotationId] = React.useState<string>("");
    const [originalRecord, setOriginalRecord] = React.useState<AnnotationTasks>();
    const [error, setError] = React.useState<string>("");

    function findRecordButtonClick() {
        const record = findRecord(props.annotationRecords, annotationId)
        if (!record) {
            setError("No record with that id found.")
            return
        }
        setOriginalRecord(record)

        // does next pop up, need to clear the values

    }

    return (
        <Modal
            onDismiss={() => props.setVisible(false)}
            visible={props.visible}
            header="Updating annotation record"
        >
            Enter the id of the annotation record you want to update:
            <Input
                onChange={({ detail }) => setAnnotationId(detail.value)}
                value={annotationId}
            />
            <Button onClick={() => findRecordButtonClick()}>
                Find annotation record
            </Button>

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
