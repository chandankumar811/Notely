import React, { useState } from "react";
import NavSideBar from "../Shared/NavSideBar";
import ListSideBar from "../layouts/ListSideBar";
import ChatPage from "../pages/ChatPage";
import NotePage from "../pages/NotePage";
import { useTheme } from "../../contexts/ThemeContext";
import MobileNavbar from "../Shared/MobileNavbar";

const AppLayout = () => {
  const [currentSideBar, setCurrentSideBar] = useState("chatList");
  const { isMobile } = useTheme();
  console.log(currentSideBar, "currentSideBar");
  return (
    <div className="flex h-screen w-full bg-gray-300 overflow-hidden">
      {/* Fixed Sidebar */}
      <div
        className={`flex fixed left-0 top-0 h-screen z-10 ${
          isMobile ? "w-full" : ""
        }`}
      >
        <div className={`w-12 border-r h-full z-10 ${isMobile ? "hidden" : "flex"}`}>
          <NavSideBar
            setCurrentSideBar={setCurrentSideBar}
            currentSideBar={currentSideBar}
          />
        </div>
        <div className="border-r w-full">
          <ListSideBar currentSideBar={currentSideBar} />
        </div>
      </div>
      <div className={` ${
              isMobile ? "hidden" : "flex"
            }`}>
        {currentSideBar === "chatList" && (
          <div
            className={`ml-[18rem] flex-1 h-screen  flex-col mx-auto`}
          >
            <ChatPage />
          </div>
        )}
        {currentSideBar === "noteList" && (
          <div className="ml-[18rem] flex-1 h-screen flex flex-col">
            <NotePage />
          </div>
        )}
      </div>
      <div
        className={`fixed bottom-4 left-4 right-4 z-20 ${
          isMobile ? "flex" : "hidden"
        }`}
      >
        <MobileNavbar
          setCurrentSideBar={setCurrentSideBar}
          currentSideBar={currentSideBar}
        />
      </div>
    </div>
  );
};

export default AppLayout;
