import * as React from "react";
import {ButtonDropdownProps} from "@cloudscape-design/components";

// Props interfaces needed to pass in values to components

export interface RegisterProps {
    changePageView: React.Dispatch<React.SetStateAction<string>>
    setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>
}

export interface LogInProps {
    changePageView: React.Dispatch<React.SetStateAction<string>>
    setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>
}

export interface AnnotationTaskProps {
    isAdmin: boolean
}

export interface AnnotationTasks {
    id: string,
    userName: string,
    status: string,
    originalData: string,
    annotatedData: string,
    tags: string,
}

export interface ApiResponseFormat {
    statusCode: number,
    body: string
}

export interface AddRecordProps {
    visible: boolean
    setVisible: React.Dispatch<React.SetStateAction<boolean>>
    allUsers: ReadonlyArray<ButtonDropdownProps.Item>
}

export interface UpdateRecordProps {
    visible: boolean
    setVisible: React.Dispatch<React.SetStateAction<boolean>>
    annotationRecords: AnnotationTasks[]
    allUsers: ReadonlyArray<ButtonDropdownProps.Item>
}

export interface AnnotationRecordFormProps {
    actionType: string
    buttonClick: Function
    userName: string,
    setUserName: React.Dispatch<React.SetStateAction<string>>,
    annotationStatus: string,
    setAnnotationStatus: React.Dispatch<React.SetStateAction<string>>,
    originalData: string,
    setOriginalData: React.Dispatch<React.SetStateAction<string>>,
    annotatedData: string,
    setAnnotatedData: React.Dispatch<React.SetStateAction<string>>,
    tags: string
    setTags: React.Dispatch<React.SetStateAction<string>>
    allUsers: ReadonlyArray<ButtonDropdownProps.Item>
}

export interface DeleteRecordProps {
    visible: boolean
    setVisible: React.Dispatch<React.SetStateAction<boolean>>
}

export interface AnnotationRecordSearchProps {
    allAnnotationRecords: AnnotationTasks[]
    setAnnotationRecordFound: React.Dispatch<React.SetStateAction<AnnotationTasks | undefined>>
    visible: boolean
    setVisible: React.Dispatch<React.SetStateAction<boolean>>
    actionType: string
}
