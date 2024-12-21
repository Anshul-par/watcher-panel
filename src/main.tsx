import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Toaster } from "./components/ui/sonner.tsx";
import { App } from "./App.tsx";

import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { toast } from "sonner";

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (query.state.data !== undefined) {
        toast.error(`Error: ${error.message ?? "Something went wrong"}`);
      }
    },
  }),
  defaultOptions: {
    queries: {
      retry: (_, error) => {
        const DO_NOT_RETRY_STATUS = [403, 404, 428];
        //@ts-ignore
        if (DO_NOT_RETRY_STATUS.includes(error.response?.status)) return false;

        return true;
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
    <Toaster />
  </React.StrictMode>
);
