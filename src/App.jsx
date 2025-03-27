import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { ContextProvider } from "./context/Context";
import { ConfigProvider, App as AntApp } from "antd";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          // Seed Token
          colorPrimary: "#024950",
          colorFillSecondary: "#0FA4AF",
          borderRadius: 2,

          // Alias Token
          colorBgContainer: "#fff",
        },
      }}
    >
      <ContextProvider>
        <QueryClientProvider client={queryClient}>
          <AntApp>
            <AppRoutes />
          </AntApp>
        </QueryClientProvider>
      </ContextProvider>
    </ConfigProvider>
  );
}

export default App;
