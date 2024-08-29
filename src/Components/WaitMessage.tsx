import {API_STATUS} from '../Config';
import Alert from '@cloudscape-design/components/alert';
import * as React from 'react';
import { WaitMessageProps } from '../Utils/Types';

export function WaitMessage(props: WaitMessageProps) {
    return (
        <>
            {props.apiStatus === API_STATUS.WAITING &&
                <Alert
                    statusIconAriaLabel="Info"
                    header="Please wait"
                >
                    Waiting for API response.
                    This can take a minute if there has been no activity as the API needs to spin back up.
                </Alert>
            }
        </>
    )
}
