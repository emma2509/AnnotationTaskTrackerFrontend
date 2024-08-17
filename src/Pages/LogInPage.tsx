import Button from "@cloudscape-design/components/button";
import * as React from "react";

// Props interface needed to pass in values to log in page
interface LogInProps {
    changePageView: React.Dispatch<React.SetStateAction<string>>
}

export default function LoginPage(props: LogInProps) {
    return (<Button onClick={() => props.changePageView("register")}> Click here to register </Button>)
}
