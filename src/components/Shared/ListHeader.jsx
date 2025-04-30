import { Edit, MoreVertical } from "lucide-react";
import React from "react";
import { useTheme } from "../../contexts/ThemeContext";

const Header = ({title}) => {
  const {darkMode} = useTheme()
  return (
    <div className={`${darkMode ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-600"} p-4 flex justify-between items-center w-full`}>
      <h1 className="text-xl font-bold">{title}</h1>
      <div className="flex gap-4">
        <Edit size={20} />
        <MoreVertical size={20} />
      </div>
    </div>
  );
};

export default Header;
