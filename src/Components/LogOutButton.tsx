// <-***** AWS (2025) [2] - START
import Button from "@cloudscape-design/components/button";
import Modal from "@cloudscape-design/components/modal";
import SpaceBetween from "@cloudscape-design/components/space-between";
// ->***** AWS (2025) [2] - END
import { type LogOutButtonProps } from "../Utils/Types";
// <-***** React (2025) [1] - START
import React from "react";
// ->***** React (2025) [1] - END

export function LogOutButton(props: LogOutButtonProps) {
    const [popUpVisible, setPopUpVisible] = React.useState(false);

    function changeToLogIn() {
        setPopUpVisible(false);
        props.changePageView("login");
    }

    return (
        <>
            <Button onClick={() => setPopUpVisible(true)}>Log out</Button>
            <Modal
                onDismiss={() => setPopUpVisible(false)}
                visible={popUpVisible}
                header="Are you sure you want to log out?"
            >
                <SpaceBetween direction={"horizontal"} size={"s"}>
                    <Button onClick={() => changeToLogIn()}>Yes</Button>
                    <Button onClick={() => setPopUpVisible(false)}>No</Button>
                </SpaceBetween>
            </Modal>
        </>
    );
}
