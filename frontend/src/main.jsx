import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import GlobalStyles from "./styles/GlobalStyles";
import theme from "./styles/theme";
import router from "./router";
import ErrorBoundary from "./components/layout/ErrorBoundary";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 1000 * 60 * 5 } },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <GlobalStyles />
          <ErrorBoundary>
            <RouterProvider router={router} />
          </ErrorBoundary>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
