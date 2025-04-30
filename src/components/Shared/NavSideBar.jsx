import {
  Menu,
  MessageCircleMoreIcon,
  NotebookPenIcon,
  PhoneIcon,
  SettingsIcon,
  Sun,
  Moon,
} from "lucide-react";
import React, { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext.jsx";
import { getThemeClasses } from "../../utils/theme.js";

const NavSideBar = ({setCurrentSideBar, currentSideBar}) => {
  const [expandNavSideBar, setExpandNavSideBar] = useState(false);
  const { darkMode, toggleTheme } = useTheme();
  const themeClasses = getThemeClasses(darkMode)
  const toggleExpand = () => {
    setExpandNavSideBar(!expandNavSideBar);
  };
  
   
  return (
    <div
      className={`flex flex-col ${
        expandNavSideBar ? "w-54 items-start" : "w-12 items-start"
      }  border-r border-gray-400 min-h-screen  justify-between transition-all duration-300 ${themeClasses.navSidebar} ${darkMode ? "text-gray-100" : "text-gray-800"}`}
    >
      <div className={` h-full space-y-8 p-2 ml-1`}>
        <div onClick={toggleExpand}>
          <Menu />
        </div>
        <div className={` space-y-6 cursor-pointer`}>
          <button onClick={() => {setCurrentSideBar("chatList")}} className={`flex gap-x-2 ${currentSideBar === 'chatList' ? 'text-blue-500' : ''} cursor-pointer`}>
            <MessageCircleMoreIcon size={22} />
            <span
              className={`${
                expandNavSideBar ? "opacity-100" : "opacity-0"
              } transition-opacity duration-300`}
            >
              Message
            </span>
          </button>
          <span className="flex gap-x-2">
            <PhoneIcon size={22} />{" "}
            <span
              className={`${
                expandNavSideBar ? "opacity-100" : "opacity-0"
              } transition-opacity duration-300`}
            >
              {"Call"}
              
            </span>
          </span>
          <button onClick={() => setCurrentSideBar('noteList')} className={`flex gap-x-2 cursor-pointer ${currentSideBar === 'noteList' ? "text-blue-500" : ""}`} >
            <NotebookPenIcon size={22} />{" "}
            <span
              className={`${
                expandNavSideBar ? "opacity-100" : "opacity-0"
              } transition-opacity duration-300`}
            >
              {" "}
              Notes
            </span>
          </button>
        </div>
      </div>
      <div className={`space-y-3 p-2`}>
        <button
          onClick={toggleTheme}
          className={` rounded-full flex gap-x-2 ml-1`}
        >
          {darkMode ? <Sun size={22} /> : <Moon size={22} />}{" "}
          <span
            className={`${
              expandNavSideBar ? "opacity-100" : "opacity-0"
            } transition-opacity duration-300`}
          >
            {" "}
            Theme
          </span>
        </button>
        <span className="flex gap-x-2 ml-1">
          <SettingsIcon size={22} />{" "}
          <span
            className={`${
              expandNavSideBar ? "opacity-100" : "opacity-0"
            } transition-opacity duration-300`}
          >
            {" "}
            Settings
          </span>
        </span>
        <div
          className={`flex h-8 w-8 bg-blue-500 text-white rounded-full font-bold justify-center items-center`}
        >
          <span>CK</span>
        </div>
      </div>
    </div>
  );
};

export default NavSideBar;
