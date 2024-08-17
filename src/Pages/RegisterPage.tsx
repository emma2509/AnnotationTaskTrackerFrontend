import Form from "@cloudscape-design/components/form";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Button from "@cloudscape-design/components/button";
import Container from "@cloudscape-design/components/container";
import Header from "@cloudscape-design/components/header";
import FormField from "@cloudscape-design/components/form-field";
import Input from "@cloudscape-design/components/input";
import * as React from "react";
import Toggle from "@cloudscape-design/components/toggle";
import Alert from "@cloudscape-design/components/alert";
import {callApi} from "../Utils/CallApi";

// Props interface needed to pass in values to register page
interface RegisterProps {
    changePageView: React.Dispatch<React.SetStateAction<string>>
}


export default function RegisterPage(props: RegisterProps){
    // Set initial states
    const [userName, setUserName] = React.useState<string>("");
    const [firstName, setFirstName] = React.useState<string>("");
    const [secondName, setSecondName] = React.useState<string>("");
    const [teamName, setTeamName] = React.useState<string>("");
    const [password, setPassword] = React.useState<string>("");
    const [isAdmin, setIsAdmin] = React.useState<boolean>(false);
    const [errorMessage, setErrorMessage]= React.useState<undefined | string>(undefined);
    const [apiStatus, setApiStatus]= React.useState<string>(""); // hold status of api call

    async function buttonClicked() {
        setErrorMessage(undefined)
        // check if values are empty
        if (userName === "" || firstName === "" || secondName === "" || teamName === "" || password === ""){
            setErrorMessage("There is an empty value")
            // setResponse("There is an empty value")
            return
        }

        // API call to add to the database
        setApiStatus("waiting")
        const requestBody = {
            "user-name": userName,
            "first-name": firstName,
            "second-name": secondName,
            "team": teamName,
            "admin": isAdmin,
            "password": password
        }
        const apiResponse = await callApi(requestBody, "add_user", "POST")

        // check if API returns an error
        if (apiResponse["statusCode"] !== 200) {
            setErrorMessage(apiResponse["body"])
        }
        setApiStatus("completed")
        props.changePageView("annotation")
    }

    return (
        <Container header={<Header variant="h2" description="Fill in the form below to create an account">Register</Header>}>
            <Form actions={<Button variant="primary" onClick={() => buttonClicked()}>Submit</Button>}>
                <SpaceBetween size={'s'}>
                    <FormField label="User Name" description="This needs to be unique">
                        <Input onChange={({ detail }) => setUserName(detail.value)} value={userName}/>
                    </FormField>
                    <FormField label="First Name">
                        <Input onChange={({ detail }) => setFirstName(detail.value)} value={firstName}/>
                    </FormField>

                    <FormField label="Second Name">
                        <Input onChange={({ detail }) => setSecondName(detail.value)} value={secondName}/>
                    </FormField>
                    <FormField label="Team" description="Enter your team name">
                        <Input onChange={({ detail }) => setTeamName(detail.value)} value={teamName}/>
                    </FormField>
                    <FormField label="Admin">
                        <Toggle
                            onChange={({ detail }) =>
                                setIsAdmin(detail.checked)
                            }
                            checked={isAdmin}
                            description="Tick this only if you are a manager and require admin access."
                        >
                            Manager
                        </Toggle>
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
            {errorMessage &&
                <Alert
                statusIconAriaLabel="Error"
                type="error"
                header="Error"
                >
                    {errorMessage}
                </Alert>
            }
            {apiStatus === "waiting" &&
                <Alert
                statusIconAriaLabel="Info"
                header="Please wait"
                >
                    It can take a minute if this is your first time using the site
                </Alert>
            }
        </Container>
    )
}
