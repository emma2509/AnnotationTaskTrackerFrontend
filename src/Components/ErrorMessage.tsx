// <-***** AWS (2025) [2] - START
import Alert from "@cloudscape-design/components/alert";
// ->***** AWS (2025) [2] - END
// <-***** React (2025) [1] - START
import * as React from "react";
// ->***** React (2025) [1] - END
import { ErrorMessageProps } from "../Utils/Types";

export function ErrorMessage(props: ErrorMessageProps) {
    return (
        <>
            {props.errorMessage && (
                <Alert statusIconAriaLabel="Error" type="error" header="Error">
                    Error: {props.errorMessage}
                </Alert>
            )}
        </>
    );
}
