import { Trash2 } from "lucide-react";
import React, {useState, useEffect} from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import { getThemeClasses } from "../../../utils/theme";
import NoteListItem from "./NoteListItem";
import {
  setSelectedNote,
  setNoteList,
} from "../../../redux/slices/note/noteSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

const NoteList = () => {
  const { darkMode } = useTheme();
  const themeClasses = getThemeClasses(darkMode);
  // const [noteList, setNoteList] = useState([]);
  const userId = useSelector((state) => state.user.userId);
  const noteList = useSelector((state) => state.note.noteList);

  const dispatch = useDispatch();

   useEffect(() => {
    const fetchNoteList = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/note/get/note-list/${userId}`);
        if (response.status !== 200) {
          throw new Error("Failed to fetch note list");
        }
        const data = await response.data;
        dispatch(setNoteList(data));

      } catch (error) {
        console.error("Error fetching note list:", error);
      }
    };

    fetchNoteList();
   }, [])

  const selectNote = (note) => {
    dispatch(setSelectedNote(note));
  };

  console.log("NoteList: ", noteList);

  return (
    <div>
      <div className="relative">
        <div className="flex justify-between px-4 py-3 text-base">
          <span className="text-gray-500">All notes</span>
          <button
            className={`flex items-center gap-1 text-red-600 text-xs px-2 py-1 rounded-lg ${
              darkMode ? "bg-black/20" : "bg-black/5"
            }`}
          >
            <Trash2 size={12} />
            Delete All
          </button>
        </div>
      </div>

      <div className="overflow-y-auto custom-scrollbar h-[calc(100vh-15rem)] md:h-[calc(100vh-10rem)] pb-10">
        {noteList.length > 0 ? (
          [...noteList].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).map((note) => (
            <NoteListItem key={note._id} note={note} selectNote={selectNote} />
          ))
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-500">No Notes</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteList;
