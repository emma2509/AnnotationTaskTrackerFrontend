// <-***** React (2025) [1] - START
import * as React from "react";
// ->***** React (2025) [1] - END
// <-***** AWS (2025) [2] - START
import Button from "@cloudscape-design/components/button";
import Container from "@cloudscape-design/components/container";
import Header from "@cloudscape-design/components/header";
import Form from "@cloudscape-design/components/form";
import SpaceBetween from "@cloudscape-design/components/space-between";
import FormField from "@cloudscape-design/components/form-field";
import Input from "@cloudscape-design/components/input";
import Link from "@cloudscape-design/components/link";
// ->***** AWS (2025) [2] - END
import { callApi } from "../Utils/CallApi";
import { type LogInProps } from "../Utils/Types";
import { API_METHODS, API_ROUTES, API_STATUS } from "../Config";
import { ErrorMessage } from "../Components/ErrorMessage";
import { WaitMessage } from "../Components/WaitMessage";

export default function LogInPage(props: LogInProps) {
    const [userName, setUserName] = React.useState<string>("");
    const [password, setPassword] = React.useState<string>("");
    const [error, setError] = React.useState<undefined | string>(undefined);
    const [apiStatus, setApiStatus] = React.useState<API_STATUS>(
        API_STATUS.NONE,
    );

    async function buttonClicked() {
        setError(undefined); // re set error

        // check if fields are empty and returns early if this is so
        if (userName === "" || password === "") {
            setError("There are empty fields");
            return;
        }
        if (userName.includes(" ") || password.includes(" ")) {
            setError("One of your fields contains a space - this is invalid");
            return;
        }

        // api call
        setApiStatus(API_STATUS.WAITING);
        const apiResponse = await callApi(
            {},
            API_ROUTES.LOG_IN,
            API_METHODS.POST,
            userName,
            password
        );

        // handle api response
        if (apiResponse.statusCode !== 200) {
            if (apiResponse.body.includes("Error: no records found")) {
                setError("User name does not exist in database.");
            } else {
                setError(apiResponse.body);
            }
            setApiStatus(API_STATUS.ERROR);
            return;
        }
        setApiStatus(API_STATUS.SUCCESS);
        // set access level
        if (apiResponse.body.includes("admin")) {
            props.setIsAdmin(true);
        } else {
            props.setIsAdmin(false);
        }

        // Successful log in and move to next page
        alert("You have successful logged in!");
        props.setUserName(userName);
        props.setPassword(password);
        props.changePageView("annotation");
    }

    return (
        <Container header={<Header variant="h2">Log in</Header>}>
            <Form
                actions={
                    <Button
                        variant="primary"
                        onClick={async () => {
                            await buttonClicked();
                        }}
                        disabled={apiStatus === API_STATUS.WAITING}
                    >
                        Log in
                    </Button>
                }
            >
                <SpaceBetween size={"m"}>
                    <FormField label="User Name">
                        <Input
                            onChange={({ detail }) => {
                                setUserName(detail.value);
                            }}
                            value={userName}
                        />
                    </FormField>
                    <FormField label="Password">
                        <Input
                            onChange={({ detail }) => {
                                setPassword(detail.value);
                            }}
                            value={password}
                            type="password"
                        />
                    </FormField>
                </SpaceBetween>
            </Form>
            <ErrorMessage errorMessage={error} />
            <WaitMessage apiStatus={apiStatus} />
            <h4>
                Don't have an account? Click{" "}
                <Link
                    onFollow={() => {
                        props.changePageView("register");
                    }}
                >
                    here
                </Link>{" "}
                to register
            </h4>
        </Container>
    );
}
