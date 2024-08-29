import type * as React from 'react';
import { type ButtonDropdownProps } from '@cloudscape-design/components';
import { type ACTION_TYPES, type API_STATUS } from '../Config';

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
    id: string
    userName: string
    status: string
    originalData: string
    annotatedData: string
    tags: string
}

export interface ApiResponseFormat {
    statusCode: number
    body: string
}

export interface AddRecordProps {
    visible: boolean
    setVisible: React.Dispatch<React.SetStateAction<boolean>>
    allUsers: readonly ButtonDropdownProps.Item[]
}

export interface UpdateRecordProps {
    visible: boolean
    setVisible: React.Dispatch<React.SetStateAction<boolean>>
    annotationRecords: AnnotationTasks[]
    allUsers: readonly ButtonDropdownProps.Item[]
    actionType: ACTION_TYPES
}

export interface AnnotationRecordFormProps {
    actionType: ACTION_TYPES
    buttonClick: Function
    userName: string
    setUserName: React.Dispatch<React.SetStateAction<string>>
    annotationStatus: string
    setAnnotationStatus: React.Dispatch<React.SetStateAction<string>>
    originalData: string
    setOriginalData: React.Dispatch<React.SetStateAction<string>>
    annotatedData: string
    setAnnotatedData: React.Dispatch<React.SetStateAction<string>>
    tags: string
    setTags: React.Dispatch<React.SetStateAction<string>>
    allUsers: readonly ButtonDropdownProps.Item[]
    error: string | undefined
    apiStatus: API_STATUS
    visible: boolean
    setVisible: React.Dispatch<React.SetStateAction<boolean>>
}

export interface AnnotationRecordSearchProps {
    allAnnotationRecords: AnnotationTasks[]
    setAnnotationRecordFound: React.Dispatch<React.SetStateAction<AnnotationTasks | undefined>>
    visible: boolean
    setVisible: React.Dispatch<React.SetStateAction<boolean>>
    actionType: ACTION_TYPES
}

export interface ErrorMessageProps {
    errorMessage: undefined | string
}

export interface WaitMessageProps {
    apiStatus: API_STATUS
}
