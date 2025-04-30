import {
  MessageCircleMoreIcon,
  MoreVertical,
  NotebookPen,
  Users,
} from "lucide-react";
import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { getThemeClasses } from "../../utils/theme";

const NoteHeader = () => {
  const { darkMode } = useTheme();
  const themeClasses = getThemeClasses(darkMode);
  return (
    <div className={`flex flex-col ${themeClasses.noteHeader}`}>
      <div className={`flex items-center justify-between w-full border-b`}>
        <div className="flex items-center gap-2 p-2">
          <div className="flex justify-center items-center w-10 h-10 bg-blue-500 text-white rounded-full font-bold">
            NN
          </div>
          <p className="font-bold">Note Name</p>
        </div>
        <div className="flex gap-3 mr-5">
          <NotebookPen />
          <MessageCircleMoreIcon />
          <MoreVertical />
        </div>
      </div>
      <div className="flex items-center p-2 justify-between">
        <div className="font-bold text-blue-500">Note Type (#general)</div>
        <div className="flex gap-10">
          <button className="flex items-center justify-center px-3 py-2 gap-3 rounded-md border">
            <Users size={22} />4 Members
          </button>
          <div className="flex gap-3 items-center">
            <div className="flex">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-bold text-sm">
                CK
              </div>
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-500 text-white font-bold text-sm -ml-2">
                CK
              </div>
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500 text-white font-bold text-sm -ml-2">
                CK
              </div>
            </div>
            <div className="font-bold">Current editings</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteHeader;
