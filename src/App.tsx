import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { ActionIcon, Button, Center, Divider, Group, Loader, ScrollArea, Stack, Tabs, TextInput, Title, rem } from "@mantine/core";
import { IconHome2, IconSquareCheck, IconHourglassEmpty, IconSun, IconMoon } from "@tabler/icons-react";
import "./App.scss";
import Todo from "./components/Todo";
import { useCreateTodo } from "./hooks/Todo/TodoMutations";
import { NewTodoType } from "./types/Todo.type";
import { serverTimestamp } from "firebase/firestore";
import { useGetAllTodos } from "./hooks/Todo/TodoQueries";
import classes from "./ActionToggle.module.css";
import cx from "clsx";
import { useMantineColorScheme, useComputedColorScheme } from "@mantine/core";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { useMediaQuery } from "@mantine/hooks";

type FromType = {
    title: string;
};
export default function App() {
    const isMobile = useMediaQuery("(max-width:560px)");
    const iconStyle = { width: rem(25), height: rem(25) };
    const { mutateAsync } = useCreateTodo();
    const { data: todosData, isLoading } = useGetAllTodos();
    const { setColorScheme } = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme("light", { getInitialValueInEffect: true });

    //Form
    const {
        register,
        handleSubmit,
        formState: { errors,isValid },
        setValue,
        control,
    } = useForm<FromType>({ mode: "onChange" });

    //handleSubmitFrom
    function submit(data: FromType) {
        const newTodo: NewTodoType = {
            title: data.title,
            discreption: null,
            isComplete: false,
            createdAt: serverTimestamp(),
        };
        mutateAsync(newTodo);
        setValue("title", "");
    }

    return (
        <Center px={{ base: 3, md: 0 }} h={"100vh"} className="app-container">
            <Stack p={10} justify="space-between" style={{ borderRadius: 5, border: `5px solid #fab005` }} className="todo-box" gap={0}>
                <Group justify="center" pos={"absolute"}>
                    <ActionIcon
                        onClick={() => setColorScheme(computedColorScheme === "light" ? "dark" : "light")}
                        variant="default"
                        size="xl"
                        aria-label="Toggle color scheme"
                    >
                        <IconSun className={cx(classes.icon, classes.light)} stroke={1.5} />
                        <IconMoon className={cx(classes.icon, classes.dark)} stroke={1.5} />
                    </ActionIcon>
                </Group>
                <Center style={{ gridArea: "crdh" }}>
                    <Title style={{ textAlign: "center", fontSize: 50 }}>قائمة مهامي</Title>
                </Center>
                <Tabs defaultValue="allTodos" style={{ gridArea: "crdb", overflow: "hidden" }}>
                    <Divider my="sm" />
                    <Tabs.List grow dir="rtl">
                        <Tabs.Tab value="allTodos" leftSection={<IconHome2 style={iconStyle} />}>
                            جميع المهام
                        </Tabs.Tab>
                        <Tabs.Tab value="doneTodos" leftSection={<IconSquareCheck style={iconStyle} />}>
                            مهام مكتملة
                        </Tabs.Tab>
                        <Tabs.Tab value="waitingTodos" leftSection={<IconHourglassEmpty style={iconStyle} />}>
                            قيد الإنتضار
                        </Tabs.Tab>
                    </Tabs.List>

                    <ScrollArea.Autosize type="auto" scrollbarSize={6} scrollHideDelay={500} className="todos-scroll-area">
                        {isLoading ? (
                            <Center>
                                <Loader size={30} />
                            </Center>
                        ) : (
                            <>
                                <Tabs.Panel value="allTodos" className="todos-wraper">
                                    {todosData?.map((todo, i) => {
                                        return <Todo key={i} todoData={todo} />;
                                    })}
                                </Tabs.Panel>

                                <Tabs.Panel value="doneTodos" className="todos-wraper">
                                    {todosData?.map((todo, i) => {
                                        return todo.isComplete && <Todo key={i} todoData={todo} />;
                                    })}
                                </Tabs.Panel>

                                <Tabs.Panel value="waitingTodos" className="todos-wraper">
                                    {todosData?.map((todo, i) => {
                                        return !todo.isComplete && <Todo key={i} todoData={todo} />;
                                    })}
                                </Tabs.Panel>
                            </>
                        )}
                    </ScrollArea.Autosize>
                </Tabs>

                <form style={{ gridArea: "crdf" }} onSubmit={handleSubmit(submit)}>
                    <Group align="flex-start" gap={3} justify="flex-start">
                        <Button size={isMobile ? "md" : "lg"} type="submit" disabled={!isValid}>
                            Submit
                        </Button>
                        <TextInput
                            {...register("title", {
                                required:'Title Is Required',
                                minLength: {
                                    value: 15,
                                    message: "Mini Length is 15",
                                },
                            })}
                            placeholder="Write A Title"
                            size={isMobile ? "md" : "lg"}
                            style={{ flexGrow: 1 }}
                            error={errors.title?.message}
                        ></TextInput>
                    </Group>
                    <DevTool control={control} /> {/* set up the dev tool */}
                </form>
            </Stack>
        </Center>
    );
}
