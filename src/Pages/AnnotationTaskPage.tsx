import {callApi} from "../Utils/CallApi";
import * as React from "react";
import Container from "@cloudscape-design/components/container";
import Header from "@cloudscape-design/components/header";
import Table from "@cloudscape-design/components/table";
import Alert from "@cloudscape-design/components/alert";
import {formatAnnotationTaskApiResponse} from "../Utils/DataHandling";

export interface AnnotationTasks {
    id: string,
    userName: string,
    status: string,
    originalData: string,
    annotatedData: string,
    tags: string,
}

export default function AnnotationTaskPage(){

    const [annotationTasks, setAnnotationTasks] = React.useState<AnnotationTasks[]>();
    const [apiStatus, setApiStatus] = React.useState<string>("");
    const [error, setError] = React.useState<string>("");

    async function getAnnotationTasks(){
        // does api call and handles response
        setApiStatus("waiting")
        const apiResponse = await callApi("", "get_annotations", "GET")
        if (apiResponse.statusCode !== 200){
            setApiStatus("error")
            setError(apiResponse.body)
            return
        }
        setApiStatus("success")

        const formattedAnnotationTasks = formatAnnotationTaskApiResponse(apiResponse)
        if (typeof formattedAnnotationTasks == "string"){
            setError(formattedAnnotationTasks)
            return
        }
        setAnnotationTasks(formattedAnnotationTasks)
    }

    // get annotation tasks on component render
    React.useEffect(() => {
        getAnnotationTasks().then()
    }, []);

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
                />
            }

            {apiStatus === "waiting" && <Alert>Waiting for API response</Alert>}

            {error && <Alert
                statusIconAriaLabel="Error"
                type="error"
            >
                Error: {error}
            </Alert>
            }
        </Container>
    )
}
