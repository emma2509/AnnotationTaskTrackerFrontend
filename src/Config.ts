export const API_URL = "https://annotationtasktrackerbackend.onrender.com";

export enum API_STATUS {
    WAITING = "waiting",
    SUCCESS = "success",
    ERROR = "error",
    NONE = "no call",
}

export const ANNOTATION_STATUS_OPTIONS = [
    { text: "Not started", id: "Not started" },
    { text: "In progress", id: "In progress" },
    { text: "Completed", id: "Completed" },
];

export enum API_METHODS {
    POST = "POST",
    GET = "GET",
}

export enum API_ROUTES {
    ADD_USER = "add_user",
    GET_USERS = "get_users",
    GET_ANNOTATIONS = "get_annotations",
    ADD_ANNOTATION = "add_annotation",
    UPDATE_ANNOTATION = "update_annotation",
    DELETE_ANNOTATION = "delete_annotation",
    LOG_IN = "log_in"
}

export enum ACTION_TYPES {
    ADD = "Add",
    UPDATE = "Update",
    DELETE = "Delete",
}
