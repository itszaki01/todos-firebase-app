import { FieldValue, Timestamp } from "firebase/firestore"

export type TodoType = {
    id:string
    title:string
    discreption: string | null
    createdAt?:Timestamp | string
    isComplete:boolean
}


export type NewTodoType = {
    title:string
    discreption: string | null
    createdAt:FieldValue
    isComplete:boolean
}