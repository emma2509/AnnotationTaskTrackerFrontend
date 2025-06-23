import { callApi } from "../Utils/CallApi";
// <-***** React (2025) [1] - START
import * as React from "react";
// ->***** React (2025) [1] - END
// <-***** AWS (2025) [2] - START
import Container from "@cloudscape-design/components/container";
import Header from "@cloudscape-design/components/header";
import Table from "@cloudscape-design/components/table";
import Button from "@cloudscape-design/components/button";
import SpaceBetween from "@cloudscape-design/components/space-between";
import { useCollection } from "@cloudscape-design/collection-hooks";
// ->***** AWS (2025) [2] - END
import {
    formatAnnotationTaskApiResponse,
    formatGetUsersApiResponse,
    transformDatabaseTag,
} from "../Utils/DataHandling";
import { type AnnotationTaskProps, type AnnotationTasks } from "../Utils/Types";
import {
    ACTION_TYPES,
    ANNOTATION_STATUS_OPTIONS,
    API_METHODS,
    API_ROUTES,
    API_STATUS,
} from "../Config";
import {
    type ButtonDropdownProps,
    Pagination,
    TextFilter,
} from "@cloudscape-design/components";
import { ErrorMessage } from "../Components/ErrorMessage";
import { WaitMessage } from "../Components/WaitMessage";
import { LogOutButton } from "../Components/LogOutButton";
import { AnnotationRecordForm } from "../Components/AnnotationRecordForm";

export default function AnnotationTaskPage(props: AnnotationTaskProps) {
    const [currentRecord, setCurrentRecord] = React.useState<AnnotationTasks>();
    const [addRecordComponentVisible, setAddRecordComponentVisible] =
        React.useState<boolean>(false);
    const [updateRecordComponentVisible, setUpdateRecordComponentVisible] =
        React.useState<boolean>(false);
    const [deleteRecordComponentVisible, setDeleteRecordComponentVisible] =
        React.useState<boolean>(false);
    const [annotationTasks, setAnnotationTasks] = React.useState<
        AnnotationTasks[]
    >([]);
    const [apiStatus, setApiStatus] = React.useState<API_STATUS>(
        API_STATUS.NONE,
    );
    const [error, setError] = React.useState<undefined | string>(undefined);
    // set to undefined until api call has been completed and data has been received
    const [allUsers, setAllUsers] = React.useState<
        readonly ButtonDropdownProps.Item[] | undefined
    >(undefined);
    const {
        items,
        filteredItemsCount,
        collectionProps,
        filterProps,
        paginationProps,
    } = useCollection(annotationTasks, {
        filtering: {
            empty: <p>Empty</p>,
            noMatch: <p>No Match</p>,
        },
        pagination: { pageSize: 10 },
        sorting: {
            defaultState: { sortingColumn: { sortingField: "id" } },
        },
        selection: {},
    });

    async function getAnnotationTasks() {
        // does api call and handles response
        setApiStatus(API_STATUS.WAITING);
        const apiResponse = await callApi(
            {},
            API_ROUTES.GET_ANNOTATIONS,
            API_METHODS.GET,
            props.userName,
            props.password
        );
        if (apiResponse.statusCode !== 200) {
            setApiStatus(API_STATUS.ERROR);
            setError(apiResponse.body);
            return;
        }
        setApiStatus(API_STATUS.SUCCESS);

        const formattedAnnotationTasks =
            formatAnnotationTaskApiResponse(apiResponse);
        if (typeof formattedAnnotationTasks === "string") {
            setError(formattedAnnotationTasks);
            return;
        }
        setAnnotationTasks(formattedAnnotationTasks);
    }

    // need to get all users for when adding/updating annotation tasks
    async function getUsers() {
        // api call to get users
        setApiStatus(API_STATUS.WAITING);
        const getUsers = await callApi(
            {},
            API_ROUTES.GET_USERS,
            API_METHODS.GET,
            props.userName,
            props.password
        );
        if (getUsers.statusCode !== 200) {
            setApiStatus(API_STATUS.ERROR);
            setError(getUsers.body);
            return;
        }
        setApiStatus(API_STATUS.SUCCESS);

        // formats response
        const formattedUsers = formatGetUsersApiResponse(getUsers);
        if (typeof formattedUsers === "string") {
            setError(formattedUsers);
            return;
        }
        setAllUsers(formattedUsers);
    }

    // get annotation tasks and all users on component render
    React.useEffect(() => {
        getAnnotationTasks().then();
        getUsers().then();
    }, []);

    // everytime add,update or delete component visible is updated, it is checked to see if they are all false(hidden)
    // as this means the users is now viewing the main annotation page and was just using one of these components
    // and therefore the annotations need to be updated
    React.useEffect(() => {
        if (
            !addRecordComponentVisible &&
            !updateRecordComponentVisible &&
            !deleteRecordComponentVisible
        ) {
            getAnnotationTasks().then();
        }
    }, [
        addRecordComponentVisible,
        updateRecordComponentVisible,
        deleteRecordComponentVisible,
    ]);

    return (
        <Container
            header={
                <SpaceBetween direction="horizontal" size={"s"}>
                    <Header>Annotation Tasks </Header>
                    <LogOutButton changePageView={props.changePageView} />
                    <p>
                        Showing rows: {filteredItemsCount}/
                        {annotationTasks.length}
                    </p>
                </SpaceBetween>
            }
        >
            {
                <Table
                    {...collectionProps}
                    pagination={<Pagination {...paginationProps} />}
                    filter={<TextFilter {...filterProps} />}
                    columnDefinitions={[
                        {
                            id: "id",
                            header: "Annotation ID",
                            cell: (item) => item.id,
                            sortingField: "id",
                            isRowHeader: true,
                        },
                        {
                            id: "userName",
                            header: "Owner Username",
                            cell: (item) => item.userName,
                            sortingField: "userName",
                            isRowHeader: true,
                        },
                        {
                            id: "firstName",
                            header: "Owner First Name",
                            cell: (item) => item.firstName,
                            sortingField: "firstName",
                            isRowHeader: true,
                        },
                        {
                            id: "lastName",
                            header: "Owner Last Name",
                            cell: (item) => item.lastName,
                            sortingField: "lastName",
                            isRowHeader: true,
                        },
                        {
                            id: "team",
                            header: "Owner Team",
                            cell: (item) => item.team,
                            sortingField: "team",
                            isRowHeader: true,
                        },
                        {
                            id: "status",
                            header: "Status",
                            cell: (item) => item.status,
                            sortingField: "status",
                            isRowHeader: true,
                        },
                        {
                            id: "tags",
                            header: "Tags",
                            cell: (item) => item.tags,
                            sortingField: "tags",
                            isRowHeader: true,
                        },
                        {
                            id: "originalData",
                            header: "Original Data",
                            cell: (item) => item.originalData,
                            isRowHeader: true,
                        },
                        {
                            id: "annotatedData",
                            header: "Annotated Data",
                            cell: (item) => item.annotatedData,
                            isRowHeader: true,
                        },
                        {
                            id: "edit",
                            header: "Edit",
                            cell: (item) => (
                                <Button
                                    iconName="edit"
                                    disabled={
                                        !props.isAdmin &&
                                        item.userName !== props.userName
                                    }
                                    disabledReason={
                                        "You need to be the annotation task owner or admin to be able to edit this row."
                                    }
                                    onClick={() => {
                                        setUpdateRecordComponentVisible(true);
                                        setCurrentRecord({
                                            id: item.id,
                                            userName: item.userName,
                                            status: item.status,
                                            originalData: item.originalData,
                                            annotatedData: item.annotatedData,
                                            tags: transformDatabaseTag(
                                                item.tags,
                                            ),
                                            firstName: item.firstName,
                                            lastName: item.lastName,
                                            team: item.team,
                                        });
                                    }}
                                />
                            ),
                            isRowHeader: true,
                            width: 80,
                            minWidth: 80,
                        },
                        {
                            id: "delete",
                            header: "Delete",
                            cell: (item) => (
                                <Button
                                    iconName="remove"
                                    disabled={!props.isAdmin}
                                    disabledReason={
                                        "You need to be admin(a manager) to have access."
                                    }
                                    onClick={() => {
                                        {
                                            setDeleteRecordComponentVisible(
                                                true,
                                            );
                                            setCurrentRecord({
                                                id: item.id,
                                                userName: item.userName,
                                                status: item.status,
                                                originalData: item.originalData,
                                                annotatedData:
                                                    item.annotatedData,
                                                tags: item.tags,
                                                firstName: item.firstName,
                                                lastName: item.lastName,
                                                team: item.team,
                                            });
                                        }
                                    }}
                                />
                            ),
                            isRowHeader: true,
                            width: 100,
                            minWidth: 100,
                        },
                    ]}
                    items={items}
                    stripedRows
                    resizableColumns
                    stickyHeader
                    wrapLines
                    variant="embedded"
                    header={
                        <SpaceBetween direction="horizontal" size={"s"}>
                            {allUsers != null && (
                                <Button
                                    iconName="add-plus"
                                    onClick={() => {
                                        setAddRecordComponentVisible(true);
                                        setCurrentRecord({
                                            id: "",
                                            userName: allUsers[0].id,
                                            status: ANNOTATION_STATUS_OPTIONS[0]
                                                .id,
                                            originalData: "",
                                            annotatedData: "",
                                            tags: "",
                                            firstName: "",
                                            lastName: "",
                                            team: "",
                                        });
                                    }}
                                >
                                    Add annotation task
                                </Button>
                            )}
                        </SpaceBetween>
                    }
                />
            }

            <WaitMessage apiStatus={apiStatus} />
            <ErrorMessage errorMessage={error} />

            {currentRecord != null && allUsers != null && (
                <>
                    <AnnotationRecordForm
                        actionType={ACTION_TYPES.ADD}
                        visible={addRecordComponentVisible}
                        setVisible={setAddRecordComponentVisible}
                        allUsers={allUsers}
                        annotationRecord={currentRecord}
                        userName={props.userName}
                        password={props.password}
                    />
                    <AnnotationRecordForm
                        actionType={ACTION_TYPES.UPDATE}
                        visible={updateRecordComponentVisible}
                        setVisible={setUpdateRecordComponentVisible}
                        allUsers={allUsers}
                        annotationRecord={currentRecord}
                        userName={props.userName}
                        password={props.password}
                    />
                    <AnnotationRecordForm
                        actionType={ACTION_TYPES.DELETE}
                        visible={deleteRecordComponentVisible}
                        setVisible={setDeleteRecordComponentVisible}
                        allUsers={allUsers}
                        annotationRecord={currentRecord}
                        userName={props.userName}
                        password={props.password}
                    />
                </>
            )}
        </Container>
    );
}
