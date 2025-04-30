import { Search } from "lucide-react";
import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { getThemeClasses } from "../../utils/theme";

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  const { darkMode } = useTheme();
  const themeClasses = getThemeClasses(darkMode);
  return (
    <div className={`p-2 w-full`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-500" />
        </div>
        <input
          type="text"
          className={`${themeClasses.searchBar} w-full py-2 pl-10 pr-4 rounded-md text-sm text-gray-200 placeholder-gray-500 focus:outline-none`}
          placeholder="Search or start a new chat"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SearchBar;
