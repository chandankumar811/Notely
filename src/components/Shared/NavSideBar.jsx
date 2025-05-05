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
import { useSelector } from "react-redux";

const NavSideBar = ({
  setCurrentSideBar,
  setActiveTab,
  openProfile,
  setOpenProfile,
  currentSideBar,
}) => {
  const [expandNavSideBar, setExpandNavSideBar] = useState(false);
  const { darkMode, toggleTheme } = useTheme();
  const themeClasses = getThemeClasses(darkMode);
  const avatar = useSelector((state) => state.user.avatar);
  const name = useSelector((state) => state.user.name);
  const toggleExpand = () => {
    setExpandNavSideBar(!expandNavSideBar);
  };

  return (
    <div
      className={`flex flex-col ${
        expandNavSideBar ? "min-w-54 items-start" : "w-12 items-start"
      }  border-r border-gray-400 min-h-screen  justify-between ${
        themeClasses.navSidebar
      } ${darkMode ? "text-gray-100" : "text-gray-800"}`}
    >
      <div className={` h-full space-y-8 p-2 ml-1`}>
        <div onClick={toggleExpand}>
          <Menu />
        </div>
        <div className={` space-y-6 cursor-pointer`}>
          <button
            onClick={() => {
              setCurrentSideBar("chatList");
              setActiveTab("chatTab");
            }}
            className={`flex gap-x-2 ${
              currentSideBar === "chatList" ? "text-blue-500" : ""
            } cursor-pointer`}
          >
            <MessageCircleMoreIcon size={22} />
            <span
              className={`${expandNavSideBar ? "opacity-100" : "opacity-0"}  `}
            >
              Message
            </span>
          </button>
          <span className="flex gap-x-2">
            <PhoneIcon size={22} />{" "}
            <span
              className={`${expandNavSideBar ? "opacity-100" : "opacity-0"}  `}
            >
              {"Call"}
            </span>
          </span>
          <button
            onClick={() => setCurrentSideBar("noteList")}
            className={`flex gap-x-2 cursor-pointer ${
              currentSideBar === "noteList" ? "text-blue-500" : ""
            }`}
          >
            <NotebookPenIcon size={22} />{" "}
            <span
              className={`${expandNavSideBar ? "opacity-100" : "opacity-0"}  `}
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
            className={`${expandNavSideBar ? "opacity-100" : "opacity-0"}  `}
          >
            {" "}
            Theme
          </span>
        </button>
        <button className="flex gap-x-2 ml-1">
          <SettingsIcon size={22} />{" "}
          <span
            className={`${expandNavSideBar ? "opacity-100" : "opacity-0"}  `}
          >
            {" "}
            Settings
          </span>
        </button>
        <button
          onClick={() => {
            setOpenProfile(!openProfile);
            setActiveTab("profileTab");
          }}
          className={`flex h-8 w-8 bg-blue-500 text-white rounded-full gap-x-2`}
        >
          {avatar ? (
            <img
              src={avatar}
              alt="avatar"
              className="w-full h-full justify-center items-center rounded-full"
            />
          ) : (
            "U"
          )}
          <span
            className={`${
              expandNavSideBar ? "opacity-100" : "opacity-0"
            } text-wrap `}
          >
            Profile
          </span>
        </button>
      </div>
    </div>
  );
};

export default NavSideBar;
