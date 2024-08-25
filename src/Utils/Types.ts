// Props interface needed to pass in values to register page
import * as React from "react";
import {ButtonDropdownProps} from "@cloudscape-design/components";

export interface RegisterProps {
    changePageView: React.Dispatch<React.SetStateAction<string>>
}

export interface LogInProps {
    changePageView: React.Dispatch<React.SetStateAction<string>>
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

export interface AddRecordProps{
    visible: boolean
    setVisible: React.Dispatch<React.SetStateAction<boolean>>
    allUsers: ReadonlyArray<ButtonDropdownProps.Item>
}

export interface UpdateRecordProps{
    visible: boolean
    setVisible: React.Dispatch<React.SetStateAction<boolean>>
    annotationRecords: AnnotationTasks[]
}
