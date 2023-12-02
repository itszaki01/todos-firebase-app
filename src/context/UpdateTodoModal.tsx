import { Button, Group, Modal, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { TodoType } from "../types/Todo.type";
import { useUpdateTodo } from "../hooks/Todo/TodoMutations";
type updateTodosModalContextProps = {
    opened: boolean;
    openUpdateModal: () => void;
    close: () => void;
    setUpdatePostData: React.Dispatch<React.SetStateAction<TodoType>>;
};

const updateTodoModalContext = createContext<updateTodosModalContextProps>({} as updateTodosModalContextProps);

export function UpdateTodoModalProvider({ children }: { children: React.ReactNode }) {
    const [opened, { open, close }] = useDisclosure(false);
    const [updatePostData, setUpdatePostData] = useState<TodoType>({} as TodoType);
    const { mutateAsync } = useUpdateTodo();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<TodoType>({
        mode: "all",
    });

    //SetFrom Defult Values
    useEffect(() => {
        setValue("title", updatePostData.title);
        setValue("discreption", updatePostData.discreption);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updatePostData]);

    function submitAll(data: TodoType) {
        mutateAsync({...updatePostData,title:data.title,discreption:data.discreption});
        close()
    }
    return (
        <updateTodoModalContext.Provider value={{ opened, openUpdateModal: open, close, setUpdatePostData }}>
            <Modal opened={opened} onClose={close} title="Focus demo">
                <form onSubmit={handleSubmit(submitAll)}>
                    <TextInput
                        {...register("title", {
                            required:'isRequired',
                            minLength: {
                                value: 15,
                                message: "Mini Length Is 15",
                            },
                        })}
                        label="Todo Title"
                        placeholder="Edit Title"
                        error={errors.title?.message}
                    />

                    <TextInput
                        {...register("discreption", {
                            minLength: {
                                value: 15,
                                message: "Mini Length Is 15",
                            },
                        })}
                        label="Todo discreption"
                        placeholder="add descreption"
                        mt="md"
                        error={errors.discreption?.message}
                    />
                    <Group align="center" justify="center" mt={15}>
                        <Button type="submit">Submit</Button>
                        <Button onClick={close} color="red.7">
                            Cancle
                        </Button>
                    </Group>
                </form>
            </Modal>
            {children}
        </updateTodoModalContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useUpdateTodosModal = () => useContext(updateTodoModalContext);
