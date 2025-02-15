import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { ContextProvider } from "./context/Context";
import { Button, ConfigProvider, Space } from "antd";

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
        <AppRoutes />
      </ContextProvider>
    </ConfigProvider>
  );
}

export default App;
