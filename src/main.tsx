import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Notifications } from "@mantine/notifications";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme.ts";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ModalsProvider } from "@mantine/modals";
import { UpdateTodoModalProvider } from "./context/UpdateTodoModal.tsx";

const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <MantineProvider theme={theme} defaultColorScheme="dark">
            <ModalsProvider>
                <QueryClientProvider client={queryClient}>
                    <Notifications />
                    <UpdateTodoModalProvider>
                        <App />
                    </UpdateTodoModalProvider>
                    <ReactQueryDevtools />
                </QueryClientProvider>
            </ModalsProvider>
        </MantineProvider>
    </React.StrictMode>
);
