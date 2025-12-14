import React from "react";
import Routes from "./Routes";
import { SidebarProvider } from "./context/SidebarContext";

function App() {
  return (
    <SidebarProvider>
      <Routes />
    </SidebarProvider>
  );
}

export default App;
