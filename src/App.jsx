import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { ContextProvider } from "./context/Context";
import { ConfigProvider, App as AntApp } from "antd";

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
        <AntApp>
          <AppRoutes />
        </AntApp>
      </ContextProvider>
    </ConfigProvider>
  );
}

export default App;
