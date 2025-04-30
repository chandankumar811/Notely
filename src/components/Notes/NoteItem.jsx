import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { NavLink } from "react-router-dom";
import { NotebookPenIcon } from "lucide-react";
import { getThemeClasses } from "../../utils/theme";

const NoteItem = ({ notes }) => {
    const {darkMode, isMobile} = useTheme()
    const themeClasses = getThemeClasses(darkMode)
  // console.log(notes);
  return (
    <div className={`flex-1 flex flex-col overflow-y-auto gap-x-1 p-2 mb-2 `}>
      {notes.map((item) => 
        <div key={item.id} className={`flex-col flex items-start p-3 border-b ${themeClasses.item}`}>
          <h1 className={`${darkMode ? "text-gray-100" : "text-gray-900"}`}>{item.title}</h1>
          <p className={`text-xs ${darkMode ?  "text-gray-200" : "text-gray-800"} font-light`}>{item.lastedit} <span>.</span> {item.time}</p>
        </div>
      )}
      <button className="flex p-3 mt-6 outline-dashed outline-1 outline-blue-500 items-center justify-center gap-2 text-blue-500"><NotebookPenIcon size={20}/> Add Note</button>
    </div>
  );
};

export default NoteItem;
