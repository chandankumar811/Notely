import React, { act, useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { getThemeClasses } from "../../utils/theme";
import { MessageSquare, Phone, FileEdit, Settings, User } from "lucide-react";
import { set } from "mongoose";

const MobileNavbar = ({
  setCurrentSideBar,
  setOpenProfile,
  activeTab,
  setActiveTab,
}) => {
  const { darkMode } = useTheme();
  const themeClasses = getThemeClasses(darkMode);
  const navItems = [
    {
      id: "messages",
      icon: MessageSquare,
      label: "Messages",
      path: "chatList",
      activeTab: "chatTab",
    },
    { id: "calls", icon: Phone, label: "Calls", activeTab: "callTab" },
    {
      id: "notes",
      icon: FileEdit,
      label: "Notes",
      path: "noteList",
      activeTab: "noteTab",
    },
    {
      id: "settings",
      icon: Settings,
      label: "Settings",
      path: "settings",
      activeTab: "settingsTab",
    },
    {
      id: "profile",
      icon: User,
      label: "Profile",
      path: "profile",
      activeTab: "profileTab",
    },
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
                activeTab === item.activeTab
                  ? "bg-blue-500 text-white"
                  : "bg-transparent"
              } `}
              onClick={() => {
                if (item.path === "profile") {
                  setOpenProfile(true);
                  setActiveTab(item.activeTab);
                } else {
                  setCurrentSideBar(item.path);
                  setOpenProfile(false);
                  setActiveTab(item.activeTab);
                }
              }}
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
