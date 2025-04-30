import SidebarIcon from "./components/Shared/SidebarIcon";
import React from "react";
import LandingPage from "./LandingPage";
import { ThemeProvider } from "./contexts/ThemeContext.jsx";
import ChatPage from "./components/pages/ChatPage.jsx";
import ChatHeader from "./components/Chat/ChatHeader.jsx";
import AppLayout from "./components/layouts/AppLayout.jsx";

function App() {
  return (
    <ThemeProvider>
      <AppLayout />
      {/* <LandingPage/> */}
    </ThemeProvider>
  );
}

export default App;
