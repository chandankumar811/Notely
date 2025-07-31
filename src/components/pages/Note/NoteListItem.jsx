import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import { getThemeClasses } from "../../../utils/theme";
import { Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNote } from "../../../contexts/NoteContext";

const NoteListItem = ({ note, selectNote }) => {
  const { darkMode } = useTheme();
  const themeClasses = getThemeClasses(darkMode);
  const {setEditNoteProfileOpen} = useNote();
  const selectedNote = useSelector(state => state.note);
//   console.log(note.id);
const dispatch = useDispatch();
// const selectedNote = useSelector(state => state.note.selectedNote);

// console.log("SelectedNote: -", note);

  return (
    <div>
      <div key={note.noteId} className={`relative flex items-center p-4 cursor-pointer ${selectNote?.noteId === note.noteId ? themeClasses.chatContactActive : themeClasses.chatContact}`} onClick={() => (selectNote(note), setEditNoteProfileOpen(false))}>
        <div className="relative">
          <div
            className={`w-12 h-12 rounded-full ${themeClasses.contactInitialBg} flex items-center justify-center font-bold`}
          >
            <img
              src="./LOGO.png"
              alt=""
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>

        <div className="ml-3 flex-1 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="flex font-semibold text-base">{note.title}</span>
            <div
              className={`flex items-center gap-1 text-sm ${themeClasses.contactStatusText}`}
            >
              <span>Last edit: 1 hour ago</span>
            </div>
          </div>

          <div className="flex justify-between items-center gap-2">
            <span className={`text-[9px] ${themeClasses.contactStatusText}`}>
              Date
            </span>
            <div>
              <button
                className={`p-2 ${
                  darkMode ? "bg-black/20" : "bg-black/5"
                } rounded-full text-red-400`}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteListItem;
