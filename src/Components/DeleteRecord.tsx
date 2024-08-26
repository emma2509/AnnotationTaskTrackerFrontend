import Modal from "@cloudscape-design/components/modal";
import * as React from "react";

interface DeleteRecordProps {
    visible: boolean
    setVisible: React.Dispatch<React.SetStateAction<boolean>>
}

export function DeleteRecord(props: DeleteRecordProps){
    return(
        <Modal
            onDismiss={() => props.setVisible(false)}
            visible={props.visible}
            header="Delete record"
        >
            Temp
        </Modal>
    )
}
