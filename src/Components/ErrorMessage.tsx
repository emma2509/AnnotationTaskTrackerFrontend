import Alert from '@cloudscape-design/components/alert';
import * as React from 'react';
import { ErrorMessageProps } from '../Utils/Types';

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
