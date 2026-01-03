import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";
import { Toaster } from "./components/ui/sonner.tsx";
import { QueryProvider } from "./lib/query-provider.tsx";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryProvider>
      <BrowserRouter>
        <App />
        <Toaster position="top-center" />
      </BrowserRouter>
    </QueryProvider>
  </StrictMode>,
);
