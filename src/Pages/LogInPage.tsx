import Button from '@cloudscape-design/components/button';
import * as React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Form from '@cloudscape-design/components/form';
import SpaceBetween from '@cloudscape-design/components/space-between';
import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';
import Link from '@cloudscape-design/components/link';
import { callApi } from '../Utils/CallApi';
import { type LogInProps } from '../Utils/Types';
import { API_METHODS, API_ROUTES, API_STATUS } from '../Config';
import { ErrorMessage } from '../Components/ErrorMessage';
import { WaitMessage } from '../Components/WaitMessage';

export default function LogInPage (props: LogInProps) {
    const [userName, setUserName] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');
    const [error, setError] = React.useState<undefined | string>(undefined);
    const [apiStatus, setApiStatus] = React.useState<API_STATUS>(API_STATUS.NONE);

    async function buttonClicked () {
        setError(undefined); // re set error

        // check if fields are empty and returns early if this is so
        if (userName === '' || password === '') {
            setError('There are empty fields');
            return;
        }
        if (userName.includes(' ') || password.includes(' ')) {
            setError('One of your fields contains a space - this is invalid');
            return;
        }

        // api call
        const body = {
            'user-name': userName
        };
        setApiStatus(API_STATUS.WAITING);
        const apiResponse = await callApi(body, API_ROUTES.GET_USER_PASSWORD, API_METHODS.POST);

        // handle api response
        if (apiResponse.statusCode !== 200) {
            setError(apiResponse.body);
            setApiStatus(API_STATUS.ERROR);
            return;
        }
        setApiStatus(API_STATUS.SUCCESS);
        if (apiResponse.body[0][0] !== password) { // API returns a 2D array so need to check index 0,0
            setError('Password is incorrect');
            return;
        }

        // get user access level

        setApiStatus(API_STATUS.WAITING);
        const userAccessApi = await callApi(body, API_ROUTES.GET_USER_ACCESS, API_METHODS.POST);
        if (userAccessApi.statusCode !== 200) {
            setError(userAccessApi.body);
            setApiStatus(API_STATUS.ERROR);
            return;
        }
        setApiStatus(API_STATUS.SUCCESS);

        if (String(userAccessApi.body[0][0]) === 'true') { // check against string version of response
            props.setIsAdmin(true);
        } else {
            props.setIsAdmin(false);
        }

        // Successful log in and move to next page
        alert('You have successful logged in!');
        props.changePageView('annotation');
    }

    return (
        <Container header={<Header variant="h2">Log in</Header>}>
            <Form actions={<Button variant="primary" onClick={async () => { await buttonClicked(); }}>Log in</Button>}>
                <SpaceBetween size={'m'}>
                    <FormField label="User Name">
                        <Input onChange={({ detail }) => { setUserName(detail.value); }} value={userName}/>
                    </FormField>
                    <FormField label="Password">
                        <Input
                            onChange={({ detail }) => { setPassword(detail.value); }}
                            value={password}
                            type="password"
                        />
                    </FormField>
                </SpaceBetween>
            </Form>
            <ErrorMessage
                errorMessage={error}
            />
            <WaitMessage
                apiStatus={apiStatus}
            />
            <h4>Don't have an account? Click <Link onFollow={() => { props.changePageView('register'); }}>here</Link> to register</h4>
        </Container>
    );
}
