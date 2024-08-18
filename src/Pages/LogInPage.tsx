import Button from "@cloudscape-design/components/button";
import * as React from "react";
import Container from "@cloudscape-design/components/container";
import Header from "@cloudscape-design/components/header";
import Form from "@cloudscape-design/components/form";
import SpaceBetween from "@cloudscape-design/components/space-between";
import FormField from "@cloudscape-design/components/form-field";
import Input from "@cloudscape-design/components/input";
import Alert from "@cloudscape-design/components/alert";
import Link from "@cloudscape-design/components/link";
import {callApi} from "../Utils/CallApi";

// Props interface needed to pass in values to log in page
interface LogInProps {
    changePageView: React.Dispatch<React.SetStateAction<string>>
}

export default function LoginPage(props: LogInProps) {
    const [userName, setUserName] = React.useState<string>("");
    const [password, setPassword] = React.useState<string>("");
    const [error, setError] = React.useState<undefined | string>(undefined);
    const [waiting, setWaiting] = React.useState<boolean>(false);

    async function buttonClicked(){
        setError(undefined) // re set error

        // check if fields are empty and returns early if this is so
        if (userName === "" || password === ""){
            setError("There are empty fields")
            return
        }

        // api call
        const body = {
            "user-name": userName
        }
        setWaiting(true)
        const apiResponse = await callApi(body, "get_user", "POST")
        setWaiting(false)

        // handle api response
        if (apiResponse["statusCode"] !== 200){
            setError(apiResponse["body"])
            return
        }
        props.changePageView("annotation")
    }

    return (
        <Container header={<Header variant="h2">Log in</Header>}>
            <Form actions={<Button variant="primary" onClick={() => buttonClicked()}>Log in</Button>}>
                <SpaceBetween size={'m'}>
                    <FormField label="User Name">
                        <Input onChange={({ detail }) => setUserName(detail.value)} value={userName}/>
                    </FormField>
                    <FormField label="Password">
                        <Input
                            onChange={({ detail }) => setPassword(detail.value)}
                            value={password}
                            type="password"
                        />
                    </FormField>
                </SpaceBetween>
            </Form>
            {error &&
                <Alert
                    statusIconAriaLabel="Error"
                    type="error"
                >
                    {error}
                </Alert>
            }
            {waiting &&
                <Alert>
                    Waiting for back end response - this sometimes can take a minute
                </Alert>
            }
            <h4>Don't have an account? Click <Link onFollow={() => props.changePageView("register")}>here</Link> to register</h4>
        </Container>
    )
}
