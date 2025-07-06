import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./api/queryClient";
import AppRoutes from "./routes";
import "./index.css";
import "sweetalert2/dist/sweetalert2.min.css";
import Footer from "./components/Footer";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
        <Footer />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
