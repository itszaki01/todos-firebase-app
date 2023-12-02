import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NewTodoType, TodoType } from "../../types/Todo.type";
import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase.config";
import { notifications } from "@mantine/notifications";

//Create Todo Hook
export function useCreateTodo() {
    const queryClient = useQueryClient();
    async function createTodo(todosData: NewTodoType) {
        try {
            const collectionRed = collection(db, "todos");
            await addDoc(collectionRed, todosData);
        } catch (error) {
            console.log(error);
            const _error = error as { message: string };
            throw Error(_error.message);
        }
    }

    return useMutation({
        mutationFn: (todoData: NewTodoType) => createTodo(todoData),
        onSuccess: (_, todo) => {
            notifications.show({
                title: "Todo Created Successfuly",
                message: `${todo.title} - todo is created`,
                color: "green",
            });
            queryClient.invalidateQueries({ queryKey: ["getAllTodos"] });
        },
        onError: (error, todo) => {
            notifications.show({
                title: `${error}`,
                message: `${todo.title} is not Created`,
                color: "red",
            });
        },
    });
}

//Update Todo Hook
export function useUpdateTodo() {
    const queryClient = useQueryClient();
    async function updateNewTodo(updateTodo: TodoType) {
        try {
            const docRef = doc(db, "todos", updateTodo.id);
            await updateDoc(docRef, updateTodo);
        } catch (error) {
            console.log(error);
            const _error = error as { message: string };
            throw Error(_error.message);
        }
    }
    return useMutation({
        mutationFn: (updateTodo: TodoType) => updateNewTodo(updateTodo),
        onSuccess: (_, todo) => {
            notifications.show({
                title: "Todo Updated Successfuly",
                message: `${todo.title} - todo is Updated`,
                color: "green",
            });
            queryClient.invalidateQueries({ queryKey: ["getAllTodos"] });
        },
        onError: (error, todo) => {
            notifications.show({
                title: `${error}`,
                message: `${todo.title} is not Updated`,
                color: "red",
            });
        },
    });
}

//DeleteDoc Hook

export function useDeleteTodo() {
    const queryClient = useQueryClient();

    async function deleteTodo(todosData: TodoType) {
        try {
            const docRef = doc(db, "todos", todosData.id);
            await deleteDoc(docRef);
        } catch (error) {
            console.log(error);
            const _error = error as { message: string };
            throw Error(_error.message);
        }
    }

    return useMutation({
        mutationFn: (todoData: TodoType) => deleteTodo(todoData),
        onSuccess: (_, todo) => {
            notifications.show({
                title: "Todo Deleted",
                message: `${todo.title} - todo is Deleted`,
                color: "green",
            });
            queryClient.invalidateQueries({ queryKey: ["getAllTodos"] });
        },
        onError: (error, todo) => {
            notifications.show({
                title: `${error}`,
                message: `${todo.title} is not Deleted`,
                color: "red",
            });
        },
    });
}
