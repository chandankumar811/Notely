import React, { useState } from "react";
import ChatListItem from "./ChatListItem";
import SearchBar from "../Shared/SearchBAr";
import Header from "../Shared/ListHeader";
import { useTheme } from "../../contexts/ThemeContext";
import { getThemeClasses } from "../../utils/theme";

const ChatSideBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { darkMode, isMobile } = useTheme();
  const themeClasses = getThemeClasses(darkMode)

  const chatData = [
    {
      id: 1,
      name: "Anish Ncell Gupta",
      lastMessage: "Video call",
      time: "11:49 PM",
      avatar: "/api/placeholder/40/40",
      unread: 0,
      status: "In call",
      isOnline: true,
    },
    {
      id: 2,
      name: "THE DEVELOPER COM...",
      lastMessage: "~PRINCE MISHRA: Fronte...",
      time: "Yesterday",
      avatar: null,
      unread: 3,
      isGroup: true,
    },
    {
      id: 3,
      name: "Laila ❤️",
      lastMessage: "Image",
      time: "Yesterday",
      avatar: "/api/placeholder/40/40",
      unread: 1,
      hasMedia: true,
    },
    {
      id: 4,
      name: "G.U.L.G.U.L",
      lastMessage: "bhai aese hi bna dena",
      time: "Yesterday",
      avatar: "/api/placeholder/40/40",
      unread: 0,
    },
    {
      id: 5,
      name: "AI",
      lastMessage: "Team 080: AI report.docx · 9...",
      time: "Yesterday",
      avatar: null,
      unread: 5,
      hasFile: true,
    },
    {
      id: 6,
      name: "GDG Lucknow",
      lastMessage: 'Group "GDG L1" was added',
      time: "Yesterday",
      avatar: null,
      unread: 4,
      isGroup: true,
    },
    {
      id: 7,
      name: "Anand Classmate",
      lastMessage: "7459888644@ptsbis",
      time: "Yesterday",
      avatar: "/api/placeholder/40/40",
      unread: 0,
      hasLink: true,
    },
    {
      id: 8,
      name: "Sandy Sandeep 47/48",
      lastMessage: "https://www.shiksha.com/coll...",
      time: "Yesterday",
      avatar: null,
      unread: 0,
      hasLink: true,
    },
    {
      id: 9,
      name: "Aryan Srmu",
      lastMessage: "https://www.shiksha.com/coll...",
      time: "Yesterday",
      avatar: "/api/placeholder/40/40",
      unread: 0,
      hasLink: true,
    },
    {
      id: 10,
      name: "Compiler Design (BCS-...",
      lastMessage: "Geetanshu: Sir, what about ppt....",
      time: "Yesterday",
      avatar: "/api/placeholder/40/40",
      unread: 0,
      isGroup: true,
    },
  ];

  return (
    <div className={`flex flex-col h-screen ${themeClasses.container} ${isMobile ? "w-full " : "min-w-81.5"} mx-auto`}>
      <Header title={"Chats"}/>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <ChatListItem chats={chatData} />
    </div>
  );
};

export default ChatSideBar;
