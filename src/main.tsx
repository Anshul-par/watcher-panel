import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Toaster } from "./components/ui/sonner.tsx";
import { App } from "./App.tsx";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
    <Toaster />
  </React.StrictMode>
);
