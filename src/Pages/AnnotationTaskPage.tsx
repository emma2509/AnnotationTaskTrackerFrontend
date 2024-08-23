import {callApi} from "../Utils/CallApi";
import * as React from "react";
import Container from "@cloudscape-design/components/container";
import Header from "@cloudscape-design/components/header";
import Table from "@cloudscape-design/components/table";
import Alert from "@cloudscape-design/components/alert";
import Button from "@cloudscape-design/components/button";
import {formatAnnotationTaskApiResponse, formatGetUsersApiResponse} from "../Utils/DataHandling";
import {AnnotationTasks} from "../Utils/Types";
import {API_STATUS} from "../Config";
import {AddRecord} from "../Components/AddRecord";
import {ButtonDropdownProps} from "@cloudscape-design/components";


export default function AnnotationTaskPage(){
    const [addRecordComponentVisible, setAddRecordComponentVisible] = React.useState<boolean>(false);
    const [annotationTasks, setAnnotationTasks] = React.useState<AnnotationTasks[]>();
    const [apiStatus, setApiStatus] = React.useState<API_STATUS>(API_STATUS.NONE);
    const [error, setError] = React.useState<undefined | string>(undefined);
    // set to undefined until api call has been completed and data has been received
    const [allUsers, setAllUsers] = React.useState<ReadonlyArray<ButtonDropdownProps.Item> | undefined>(undefined);

    async function getAnnotationTasks(){
        // does api call and handles response
        setApiStatus(API_STATUS.WAITING)
        const apiResponse = await callApi("", "get_annotations", "GET")
        if (apiResponse.statusCode !== 200){
            setApiStatus(API_STATUS.ERROR)
            setError(apiResponse.body)
            return
        }
        setApiStatus(API_STATUS.SUCCESS)

        const formattedAnnotationTasks = formatAnnotationTaskApiResponse(apiResponse)
        if (typeof formattedAnnotationTasks == "string"){
            setError(formattedAnnotationTasks)
            return
        }
        setAnnotationTasks(formattedAnnotationTasks)
    }

    // need to get all users for when adding/updating annotation tasks
    async function getUsers(){
        // api call to get users
        setApiStatus(API_STATUS.WAITING)
        const getUsers = await callApi("", "get_users", "GET");
        if (getUsers.statusCode !== 200){
            setApiStatus(API_STATUS.ERROR)
            setError(getUsers.body)
            return
        }
        setApiStatus(API_STATUS.SUCCESS)

        // formats response
        const formattedUsers = formatGetUsersApiResponse(getUsers);
        if (typeof formattedUsers === "string"){
            setError(formattedUsers)
            return
        }
        setAllUsers(formattedUsers)
    }

    // get annotation tasks and all users on component render
    React.useEffect(() => {
        getAnnotationTasks().then()
        getUsers().then()
    }, []);

    // everytime addRecordComponentVisible is updated it is checked to see if it is false and if so the table is updated
    React.useEffect(() => {
        if (!addRecordComponentVisible){
            getAnnotationTasks().then()
        }
    }, [addRecordComponentVisible])

    return (
        <Container header={<Header>Annotation Tasks </Header>}>
            {annotationTasks &&
                <Table
                    columnDefinitions={[
                        {
                            id: "id",
                            header: "Annotation ID",
                            cell: item => item.id,
                            isRowHeader: true
                        },
                        {
                            id: "userName",
                            header: "Owner",
                            cell: item => item.userName
                        },
                        {
                            id: "status",
                            header: "Status",
                            cell: item => item.status
                        },
                        {
                            id: "tags",
                            header: "Tags",
                            cell: item => item.tags
                        },
                        {
                            id: "originalData",
                            header: "Original Data",
                            cell: item => item.originalData
                        },
                        {
                            id: "annotatedData",
                            header: "Annotated Data",
                            cell: item => item.annotatedData
                        }
                    ]}
                    items={annotationTasks}
                    sortingDisabled
                    stripedRows
                    resizableColumns
                    stickyHeader
                    variant="embedded"
                    header={
                    <Button iconName="add-plus" onClick={() => setAddRecordComponentVisible(true)}>
                        Add annotation task
                    </Button>
                }
                />
            }

            {apiStatus === API_STATUS.WAITING && <Alert>Waiting for API response. This sometimes can take a while if this is the first API call</Alert>}

            {error && <Alert
                statusIconAriaLabel="Error"
                type="error"
            >
                Error: {error}
            </Alert>
            }

            {allUsers &&
                <AddRecord
                    visible={addRecordComponentVisible}
                    setVisible={setAddRecordComponentVisible}
                    allUsers={allUsers}
                />
            }
        </Container>
    )
}
