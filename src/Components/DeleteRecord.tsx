import Modal from "@cloudscape-design/components/modal";
import * as React from "react";
import {DeleteRecordProps} from "../Utils/Types";


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
