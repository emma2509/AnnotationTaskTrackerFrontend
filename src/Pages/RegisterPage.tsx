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
import {RegisterProps} from "../Utils/Types";
import {API_STATUS} from "../Config";


export default function RegisterPage(props: RegisterProps){
    // Set initial states
    const [userName, setUserName] = React.useState<string>("");
    const [firstName, setFirstName] = React.useState<string>("");
    const [lastName, setLastName] = React.useState<string>("");
    const [teamName, setTeamName] = React.useState<string>("");
    const [password, setPassword] = React.useState<string>("");
    const [isAdmin, setIsAdmin] = React.useState<boolean>(false);
    const [errorMessage, setErrorMessage]= React.useState<undefined | string>(undefined);
    const [apiStatus, setApiStatus]= React.useState<API_STATUS>(API_STATUS.NONE); // hold status of api call

    async function buttonClicked() {
        setErrorMessage(undefined)
        // check if values are empty
        if (userName === "" || firstName === "" || lastName === "" || teamName === "" || password === ""){
            setErrorMessage("There is an empty value")
            return
        }
        if (userName.includes(" ") || firstName.includes(" ") || lastName.includes(" ") || teamName.includes(" ") || password.includes(" ")){
            setErrorMessage("One of your fields contains a space - this is not allowed")
            return
        }

        // API call to add to the database
        setApiStatus(API_STATUS.WAITING)
        const requestBody = {
            "user-name": userName,
            "first-name": firstName,
            "last-name": lastName,
            "team": teamName,
            "admin": isAdmin,
            "password": password
        }
        const apiResponse = await callApi(requestBody, "add_user", "POST")

        // check if API returns an error
        if (apiResponse.statusCode !== 200) {
            setErrorMessage(apiResponse.body)
            setApiStatus(API_STATUS.ERROR)
            return
        }
        setApiStatus(API_STATUS.SUCCESS)
        alert("Your account has been successfully created!");
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

                    <FormField label="Last Name">
                        <Input onChange={({ detail }) => setLastName(detail.value)} value={lastName}/>
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
            {apiStatus === API_STATUS.WAITING &&
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
