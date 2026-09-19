import React from "react";
import ReactDOM from "react-dom/client";
import { QueryProvider } from "@/providers/query-provider";
import { App } from "@/app/App";
import "@/styles/index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryProvider>
      <App />
    </QueryProvider>
  </React.StrictMode>,
);
