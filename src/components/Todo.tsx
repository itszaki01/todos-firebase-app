import { ActionIcon, Divider, Grid, Group, Stack, Text, useMantineColorScheme, useMantineTheme } from "@mantine/core";
import { IconCheck, IconPencil, IconTrash } from "@tabler/icons-react";
import "./Todo.scss";
import { TodoType } from "../types/Todo.type";
import { useDeleteTodo, useUpdateTodo } from "../hooks/Todo/TodoMutations";
import { modals } from "@mantine/modals";
import { useUpdateTodosModal } from "../context/UpdateTodoModal";

type TodoProps = {
    todoData: TodoType;
};
export default function Todo({ todoData: { id, title, discreption, isComplete } }: TodoProps) {
    const theme = useMantineTheme();
    const {colorScheme:colorSchema} = useMantineColorScheme();
    const { mutateAsync: updateTodoMutation } = useUpdateTodo();
    const { mutateAsync: deleteTodoMutation } = useDeleteTodo();
    const { openUpdateModal, setUpdatePostData } = useUpdateTodosModal();
    
    //handleCheckUpdateClick
    function handleCheckUpdateClick() {
        updateTodoMutation({ id, title, discreption, isComplete: !isComplete });
    }

    //handleEditTodoBtnClick
    function handleEditTodoBtnClick() {
        openUpdateModal();
        setUpdatePostData({ id, title, discreption, isComplete });
    }

    //handleDeleteBtnClicked
    function handleDeleteBtnClicked() {
        modals.openConfirmModal({
            title: "Confirm Delete",
            children: (
                <Text size="sm">
                    This action is so important that you are required to confirm it with a modal. Please click one of these buttons to proceed.
                </Text>
            ),
            labels: { confirm: "Delete Todo", cancel: "Cancle" },
            onConfirm: () => deleteTodoMutation({ id, title, discreption, isComplete }),
        });
    }
    return (
        <Grid
            id={id}
            gutter={"xs"}
            dir="rtl"
            p={10}
            style={{ borderRadius: 5, border: "2px solid black" }}
            mt={5}
            className="todo-container"
            bg={colorSchema === "dark" ? "gray.9" : "gray.1"}
        >
            <Grid.Col span={8}>
                <Stack >
                    <Text truncate="end" fz={25}>
                        {title}
                    </Text>
                    <Text size="lg" truncate="end">
                        {" "}
                        {discreption}
                    </Text>
                </Stack>
            </Grid.Col>
            <Grid.Col span={4}>
                <Group justify="space-around" h={120} align="center" gap={2}>
                    <Divider size="sm" orientation="vertical" />
                    <ActionIcon onClick={handleEditTodoBtnClick} variant="filled" size="xl" radius="xl" style={{ border: "2px solid black" }}>
                        <IconPencil color="black" />
                    </ActionIcon>
                    <ActionIcon
                        variant="filled"
                        size="xl"
                        radius="xl"
                        bg={isComplete ? "green" : theme.primaryColor}
                        style={{ border: "2px solid black" }}
                        onClick={handleCheckUpdateClick}
                    >
                        <IconCheck color="black" />
                    </ActionIcon>
                    <ActionIcon onClick={handleDeleteBtnClicked} variant="filled" size="xl" radius="xl" style={{ border: "2px solid black" }}>
                        <IconTrash color="black" />
                    </ActionIcon>
                </Group>
            </Grid.Col>
        </Grid>
    );
}
