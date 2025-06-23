import { API_STATUS } from "../Config";
// <-***** AWS (2025) [2] - START
import Alert from "@cloudscape-design/components/alert";
// ->***** AWS (2025) [2] - END
// <-***** React (2025) [1] - START
import * as React from "react";
// ->***** React (2025) [1] - END
import { WaitMessageProps } from "../Utils/Types";

export function WaitMessage(props: WaitMessageProps) {
    return (
        <>
            {props.apiStatus === API_STATUS.WAITING && (
                <Alert statusIconAriaLabel="Info" header="Please wait">
                    Waiting for API response. This can take a minute if there
                    has been no activity as the API needs to spin back up.
                </Alert>
            )}
        </>
    );
}
