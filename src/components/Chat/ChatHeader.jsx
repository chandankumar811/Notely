import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { Video, Phone, Search, MoreVertical, NotebookPen } from "lucide-react";
import { getThemeClasses } from "../../utils/theme";

const ChatHeader = () => {
  const { darkMode } = useTheme();
  const themeClasses = getThemeClasses(darkMode)
  return (
    <div className={`flex items-center p-2  ${themeClasses.chatHeader} border-b border-gray-700 w-full`}>
      <div className="flex items-center flex-1">
        <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
          <img
            src="/vite.svg"
            alt="Profile"
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <h1 className="font-semibold">Sudharjo</h1>
          <p className={`text-xs text-blue-500`}>online</p>
        </div>
      </div>
      <div className="flex space-x-4">
        <NotebookPen className="h-5 w-5 hover:text-blue-500 cursor-pointer" />
        <Phone className="h-5 w-5 hover:text-blue-500 cursor-pointer" />
        <Search className="h-5 w-5 hover:text-blue-500 cursor-pointer" />
        <MoreVertical className="h-5 w-5 hover:text-blue-500 cursor-pointer" />
      </div>
    </div>
  );
};

export default ChatHeader;
