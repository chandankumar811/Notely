import React from "react";
import NavSideBar from "../Shared/NavSideBar";
import ChatListItem from "../Chat/ChatListItem";
import ListSideBar from "../layouts/ListSideBar";
import ChatHeader from "../Chat/ChatHeader";
import NoteSidebar from "../Notes/NoteSidebar";
import MessageInput from "../Chat/MessageInput";
import { useTheme } from "../../contexts/ThemeContext";
import { getThemeClasses } from "../../utils/theme";
import MessageBubble from "../Chat/MessageBubble";

const ChatPage = () => {
  const { darkMode } = useTheme();
  const themeClasses = getThemeClasses(darkMode);
  return (
    <div className="flex h-screen w-full bg-gray-300 ">
      <div className="ml-[18rem] flex-1 h-screen flex flex-col">
        {/* Fixed Header */}
        <div className="fixed top-0 right-0 left-[23.5rem] z-20 bg-white border-b">
          <ChatHeader />
        </div>

        {/* Scrollable body (under header) */}
        <div
          className={`fixed top-[3.6rem] left-[23.5rem] w-full h-full ${themeClasses.chatArea}`}
        >
           <div className="fixed top-14 left-[23.5rem] right-0 p-3 overflow-auto h-[calc(100vh-3.6rem)]">
          <MessageBubble />
        </div>
        </div>
        <div className="fixed bottom-0 left-[23.5rem] right-0">
          <MessageInput />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
