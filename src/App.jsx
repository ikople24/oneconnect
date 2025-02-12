import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { ContextProvider } from "./context/Context";

function App() {
  return (
    <ContextProvider>
      <AppRoutes />
    </ContextProvider>
  );
}

export default App;
