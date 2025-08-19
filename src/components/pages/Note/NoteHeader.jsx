import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import { getThemeClasses } from "../../../utils/theme";
import {
  ArrowLeft,
  Trash2,
  EllipsisVerticalIcon,
  Pencil,
  X,
} from "lucide-react";
import {
  deleteNoteItem,
  setSelectedNote,
} from "../../../redux/slices/note/noteSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNote } from "../../../contexts/NoteContext";
import axios from "axios";

const NoteHeader = () => {
  const { darkMode, isMobile } = useTheme();
  const themeClasses = getThemeClasses(darkMode);
  const dispatch = useDispatch();
  const [isNoteOption, setIsNoteOption] = useState(false);
  const noteOptionRef = useRef(null);
  const { selectedNote } = useSelector((state) => state.note);
  const { userId } = useSelector((state) => state.user);
  const { setEditNoteProfileOpen } = useNote();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        noteOptionRef.current &&
        !noteOptionRef.current.contains(event.target)
      ) {
        setIsNoteOption(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
 

  const handleDeleteNoteByParticipant = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/note/delete-note-by-participant/${selectedNote.noteId}/${userId}`
      );


      if (response.status === 200) {
        dispatch(deleteNoteItem(selectedNote.noteId));
        dispatch(setSelectedNote(null))
        console.log("Note deleted successfully by participants");
      }
    } catch (error) {
      console.error("Error to delete note by participant");
    }
  };

  const handleDeleteNote = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/note/delete-note/${selectedNote.noteId}`
      );



      if (response.status === 200) {
        dispatch(deleteNoteItem(selectedNote.noteId));
        dispatch(setSelectedNote(null));
        console.log("Note deleted successfully by creator");
      }
    } catch (error) {
      console.error("Error to delete note by creator");
    }
  };

  return (
    <div
      ref={noteOptionRef}
      className={`flex items-center justify-between p-4 relative ${themeClasses.chatHeader} `}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <button
            className={`p-2 ${isMobile ? "flex" : "hidden"}`}
            onClick={() => dispatch(setSelectedNote(null))}
          >
            <ArrowLeft />
          </button>
          <div>
            <div
              className={`w-12 h-12 flex items-center justify-center font-bold`}
            >
              <img
                src={selectedNote?.avatar}
                alt=""
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>
          <h1 className="text-2xl font-semibold">{selectedNote.title}</h1>
        </div>
        <button
          onClick={() => setIsNoteOption((prev) => !prev)}
          className={`p-2 rounded-full ${
            darkMode
              ? `${isNoteOption && "bg-gray-700"} hover:bg-gray-700`
              : `${isNoteOption && "bg-gray-200"} hover:bg-gray-200`
          }`}
        >
          <EllipsisVerticalIcon size={22} className={themeClasses.headerIcon} />
        </button>
      </div>
      {isNoteOption && (
        <div
          className={`absolute z-10 right-0 top-[100%] p-2 flex flex-col ${themeClasses.chatHeader} shadow-md border rounded-md w-max`}
        >
          <button
            onClick={() => dispatch(setSelectedNote(null))}
            className={`flex items-center gap-2 px-2 py-1 ${
              darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
            } rounded-md`}
          >
            <X size={18} />
            Close note
          </button>
          {(selectedNote.creatorId === userId ||
            selectedNote.participants?.some(
              (p) => p.userId === userId && p.privilege === "write"
            )) && (
            <button
              onClick={() => setEditNoteProfileOpen(true)}
              className={`flex items-center gap-2 px-2 py-1 ${
                darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
              } rounded-md`}
            >
              <Pencil size={18} /> Edit note profile
            </button>
          )}
          <button
            onClick={
              selectedNote.creatorId === userId
                ? handleDeleteNote
                : handleDeleteNoteByParticipant
            }
            className={`flex items-center gap-2 px-2 py-1 ${
              darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
            } rounded-md text-red-500`}
          >
            <Trash2 size={18} />
            {selectedNote.creatorId === userId
              ? "Delete Note"
              : "Leave Note"}
          </button>
        </div>
      )}
    </div>
  );
};

export default NoteHeader;
