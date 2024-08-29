export const API_URL = "https://annotationtasktrackerbackend.onrender.com"

export enum API_STATUS {
    WAITING = "waiting",
    SUCCESS = "success",
    ERROR = "error",
    NONE = "no call"
}


export const ANNOTATION_STATUS_OPTIONS = [
    { text: "Not started", id: "Not started"},
    { text: "In progress", id: "In progress"},
    { text: "Completed", id: "Completed"}
]

export enum API_METHODS {
    POST = "POST",
    GET = "GET"
}

export enum API_ROUTES {
    ADD_USER = "add_user",
    GET_USER_PASSWORD = "get_user_password",
    GET_USER_ACCESS = "get_user_access_level",
    GET_USERS = "get_users",
    GET_ANNOTATIONS = "get_annotations",
    ADD_ANNOTATION = "add_annotation",
    UPDATE_ANNOTATION = "update_annotation",
    DELETE_ANNOTATION = "delete_annotation"
}
