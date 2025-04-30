import React, { useState } from "react";
import Header from "../Shared/ListHeader";
import { useTheme } from "../../contexts/ThemeContext";
import SearchBar from "../Shared/SearchBAr";
import NoteItem from "./NoteItem";
import { getThemeClasses } from "../../utils/theme";
const NoteSidebar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { darkMode } = useTheme();
  const themeClasses = getThemeClasses(darkMode);
  const noteData = [
    {
      id: 1,
      title: "Auto Encoder",
      lastedit: "Last edited by Admin User",
      time: "1 hour ago",
    },
    {
      id: 2,
      title: "Auto Encoder",
      lastedit: "Last edited by Admin User",
      time: "1 hour ago",
    },
    {id: 3,
        title: "Auto Encoder",
        lastedit: "Last edited by Admin User",
        time: "1 hour ago"
    },
    {id: 4,
        title: "Auto Encoder",
        lastedit: "Last edited by Admin User",
        time: "1 hour ago"
    },
    {
      id: 5,
      title: "Auto Encoder",
      lastedit: "Last edited by Admin User",
      time: "1 hour ago",
    },
    {
      id: 6,
      title: "Auto Encoder",
      lastedit: "Last edited by Admin User",
      time: "1 hour ago",
    },
    {id: 7,
        title: "Auto Encoder",
        lastedit: "Last edited by Admin User",
        time: "1 hour ago"
    },
    {id: 8,
        title: "Auto Encoder",
        lastedit: "Last edited by Admin User",
        time: "1 hour ago"
    },
    {
      id: 9,
      title: "Auto Encoder",
      lastedit: "Last edited by Admin User",
      time: "1 hour ago",
    },
    {
      id: 10,
      title: "Auto Encoder",
      lastedit: "Last edited by Admin User",
      time: "1 hour ago",
    },
    {id: 11,
        title: "Auto Encoder",
        lastedit: "Last edited by Admin User",
        time: "1 hour ago"
    },
    {id: 12,
        title: "Auto Encoder",
        lastedit: "Last edited by Admin User",
        time: "1 hour ago"
    }
  ];
  
  return (
    <div
      className={`flex flex-col h-screen ${themeClasses.container} min-w-81.5 mx-auto`}
    >
      <Header title={"Notes"}/>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <NoteItem notes = {noteData}/>
    </div>
  );
};

export default NoteSidebar;
