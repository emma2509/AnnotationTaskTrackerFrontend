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
