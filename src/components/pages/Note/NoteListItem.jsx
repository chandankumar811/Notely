import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import { getThemeClasses } from "../../../utils/theme";
import { Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNote } from "../../../contexts/NoteContext";
import {
  deleteNoteItem,
  setSelectedNote,
} from "../../../redux/slices/note/noteSlice";
import axios from "axios";

const NoteListItem = ({ note, selectNote }) => {
  const { darkMode } = useTheme();
  const themeClasses = getThemeClasses(darkMode);
  const { setEditNoteProfileOpen } = useNote();
  const selectedNote = useSelector((state) => state.note);
  const { userId } = useSelector((state) => state.user);
  //   console.log(note.id);
  const dispatch = useDispatch();
  // const selectedNote = useSelector(state => state.note.selectedNote);

  console.log("SelectedNote: -", note);

  return (
    <div>
      <div
        key={note.noteId}
        className={`relative flex items-center p-4 cursor-pointer ${
          selectNote?.noteId === note.noteId
            ? themeClasses.chatContactActive
            : themeClasses.chatContact
        }`}
        onClick={() => (selectNote(note), setEditNoteProfileOpen(false))}
      >
        <div className="relative">
          <div
            className={`w-12 h-12 rounded-full ${themeClasses.contactInitialBg} flex items-center justify-center font-bold`}
          >
            {console.log("Note Avatar: ", note.avatar)}
            <img
              src={`${note.avatar}`}
              alt="avatar"
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
              {new Date(note.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteListItem;
