import type * as React from "react";
import { type ButtonDropdownProps } from "@cloudscape-design/components";
import { type ACTION_TYPES, type API_STATUS } from "../Config";

// Props interfaces needed to pass in values to components

export interface RegisterProps {
    changePageView: React.Dispatch<React.SetStateAction<string>>;
    setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
    setUserName: React.Dispatch<React.SetStateAction<string>>;
}

export interface LogInProps {
    changePageView: React.Dispatch<React.SetStateAction<string>>;
    setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
    setUserName: React.Dispatch<React.SetStateAction<string>>;
}

export interface AnnotationTaskProps {
    isAdmin: boolean;
    userName: string;
    changePageView: React.Dispatch<React.SetStateAction<string>>;
}

export interface AnnotationTasks {
    id: string;
    userName: string;
    status: string;
    originalData: string;
    annotatedData: string;
    tags: string;
    firstName: string;
    lastName: string;
    team: string;
}

export interface ApiResponseFormat {
    statusCode: number;
    body: string;
}

export interface AnnotationRecordFormProps {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    annotationRecord: AnnotationTasks;
    allUsers: readonly ButtonDropdownProps.Item[];
    actionType: ACTION_TYPES;
}

export interface ErrorMessageProps {
    errorMessage: undefined | string;
}

export interface WaitMessageProps {
    apiStatus: API_STATUS;
}

export interface LogOutButtonProps {
    changePageView: React.Dispatch<React.SetStateAction<string>>;
}
