import Alert from "@cloudscape-design/components/alert";
import * as React from "react";

interface ErrorMessageProps {
    errorMessage: undefined | string
}

export function ErrorMessage(props: ErrorMessageProps) {
    return(
        <>
            {props.errorMessage &&
                <Alert
                    statusIconAriaLabel="Error"
                    type="error"
                    header="Error"
                >
                    Error: {props.errorMessage}
                </Alert>
            }
        </>
    )
}
