import { callApi } from '../Utils/CallApi';
import * as React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Table from '@cloudscape-design/components/table';
import Alert from '@cloudscape-design/components/alert';
import Button from '@cloudscape-design/components/button';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { formatAnnotationTaskApiResponse, formatGetUsersApiResponse } from '../Utils/DataHandling';
import { type AnnotationTaskProps, type AnnotationTasks } from '../Utils/Types';
import { ACTION_TYPES, API_METHODS, API_ROUTES, API_STATUS } from '../Config';
import { AddRecord } from '../Components/AddRecord';
import { UpdateRecord } from '../Components/UpdateRecord';
import { type ButtonDropdownProps } from '@cloudscape-design/components';

export default function AnnotationTaskPage (props: AnnotationTaskProps) {
    const [addRecordComponentVisible, setAddRecordComponentVisible] = React.useState<boolean>(false);
    const [updateRecordComponentVisible, setUpdateRecordComponentVisible] = React.useState<boolean>(false);
    const [deleteRecordComponentVisible, setDeleteRecordComponentVisible] = React.useState<boolean>(false);
    const [annotationTasks, setAnnotationTasks] = React.useState<AnnotationTasks[]>();
    const [apiStatus, setApiStatus] = React.useState<API_STATUS>(API_STATUS.NONE);
    const [error, setError] = React.useState<undefined | string>(undefined);
    // set to undefined until api call has been completed and data has been received
    const [allUsers, setAllUsers] = React.useState<readonly ButtonDropdownProps.Item[] | undefined>(undefined);

    async function getAnnotationTasks () {
        // does api call and handles response
        setApiStatus(API_STATUS.WAITING);
        const apiResponse = await callApi('', API_ROUTES.GET_ANNOTATIONS, API_METHODS.GET);
        if (apiResponse.statusCode !== 200) {
            setApiStatus(API_STATUS.ERROR);
            setError(apiResponse.body);
            return;
        }
        setApiStatus(API_STATUS.SUCCESS);

        const formattedAnnotationTasks = formatAnnotationTaskApiResponse(apiResponse);
        if (typeof formattedAnnotationTasks === 'string') {
            setError(formattedAnnotationTasks);
            return;
        }
        setAnnotationTasks(formattedAnnotationTasks);
    }

    // need to get all users for when adding/updating annotation tasks
    async function getUsers () {
        // api call to get users
        setApiStatus(API_STATUS.WAITING);
        const getUsers = await callApi('', API_ROUTES.GET_USERS, API_METHODS.GET);
        if (getUsers.statusCode !== 200) {
            setApiStatus(API_STATUS.ERROR);
            setError(getUsers.body);
            return;
        }
        setApiStatus(API_STATUS.SUCCESS);

        // formats response
        const formattedUsers = formatGetUsersApiResponse(getUsers);
        if (typeof formattedUsers === 'string') {
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
        if (!addRecordComponentVisible && !updateRecordComponentVisible && !deleteRecordComponentVisible) {
            getAnnotationTasks().then();
        }
    }, [addRecordComponentVisible, updateRecordComponentVisible, deleteRecordComponentVisible]);

    return (
        <Container header={<Header>Annotation Tasks </Header>}>
            {(annotationTasks != null) &&
                <Table
                    columnDefinitions={[
                        {
                            id: 'id',
                            header: 'Annotation ID',
                            cell: item => item.id,
                            isRowHeader: true
                        },
                        {
                            id: 'userName',
                            header: 'Owner',
                            cell: item => item.userName
                        },
                        {
                            id: 'status',
                            header: 'Status',
                            cell: item => item.status
                        },
                        {
                            id: 'tags',
                            header: 'Tags',
                            cell: item => item.tags
                        },
                        {
                            id: 'originalData',
                            header: 'Original Data',
                            cell: item => item.originalData
                        },
                        {
                            id: 'annotatedData',
                            header: 'Annotated Data',
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
                        <SpaceBetween direction="horizontal" size={'s'}>
                            <Button iconName="add-plus" onClick={() => { setAddRecordComponentVisible(true); }}>
                            Add annotation task
                            </Button>
                            <Button iconName="edit" onClick={() => { setUpdateRecordComponentVisible(true); }}>
                            Update annotation task
                            </Button>
                            <Button
                                iconName="remove"
                                onClick={() => { setDeleteRecordComponentVisible(true); }}
                                disabled={!props.isAdmin}
                                disabledReason={'You need to be admin(a manager) to have access.'}
                            >
                            Delete annotation task
                            </Button>
                        </SpaceBetween>
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

            {(allUsers != null) &&
                <AddRecord
                    visible={addRecordComponentVisible}
                    setVisible={setAddRecordComponentVisible}
                    allUsers={allUsers}
                />
            }

            {((annotationTasks != null) && (allUsers != null)) &&
                <>
                    <UpdateRecord
                        actionType={ACTION_TYPES.UPDATE}
                        visible={updateRecordComponentVisible}
                        setVisible={setUpdateRecordComponentVisible}
                        annotationRecords={annotationTasks}
                        allUsers={allUsers}
                    />
                    <UpdateRecord
                        actionType={ACTION_TYPES.DELETE}
                        visible={deleteRecordComponentVisible}
                        setVisible={setDeleteRecordComponentVisible}
                        annotationRecords={annotationTasks}
                        allUsers={allUsers}
                    />
                </>
            }

        </Container>
    );
}
