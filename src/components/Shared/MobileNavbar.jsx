import React, { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { getThemeClasses } from "../../utils/theme";
import { MessageSquare, Phone, FileEdit, Settings, User } from "lucide-react";

const MobileNavbar = ({ setCurrentSideBar, currentSideBar }) => {
  const { darkMode } = useTheme();
  const themeClasses = getThemeClasses(darkMode);
  const navItems = [
    {
      id: "messages",
      icon: MessageSquare,
      label: "Messages",
      path: "chatList",
    },
    { id: "calls", icon: Phone, label: "Calls" },
    { id: "notes", icon: FileEdit, label: "Notes", path: "noteList" },
    { id: "settings", icon: Settings, label: "Settings" },
    { id: "profile", icon: User, label: "Profile" },
  ];

  return (
    <div className={`flex w-full absolute bottom-0 left-0 z-20`}>
      <nav
        className={`${themeClasses.mobileNavBar} flex justify-between items-center px-2 py-2 w-full rounded-full`}
      >
        {navItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.path}
              className={`relative flex items-center justify-center p-2 rounded-full ${
                currentSideBar === item.path ? "bg-blue-500 text-white" : "bg-transparent"
              } transition-colors duration-300`}
              onClick={() => setCurrentSideBar(item.path)}
            >
              <IconComponent size={25} />
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default MobileNavbar;
