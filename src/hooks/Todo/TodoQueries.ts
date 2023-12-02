import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase/firebase.config";
import { TodoType } from "../../types/Todo.type";

export function useGetAllTodos() {
    async function getAllTodos(): Promise<TodoType[] | undefined> {
        try {
            const collectionRef = collection(db, "todos");
            const q = query(collectionRef, orderBy("createdAt", "desc"),limit(20));
            const { docs } = await getDocs(q);
            const allTodos = docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            return allTodos as TodoType[];
        } catch (error) {
            console.log(error);
        }
    }
    return useQuery({
        queryKey: ["getAllTodos"],
        queryFn: () => getAllTodos(),
    });
}
