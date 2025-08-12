import { createSlice } from "@reduxjs/toolkit";
// import { updateDeletionChatList } from "../chat/chatSlice";

const initialState = {
  selectedNote: null,
  noteList: [],
};

export const noteSlice = createSlice({
  name: "note",
  initialState,
  reducers: {
    setSelectedNote: (state, action) => {
      state.selectedNote = action.payload;
    },
    setNoteList: (state, action) => {
      state.noteList = action.payload;
    },
    updateNoteList: (state, action) => {
      state.noteList.unshift(action.payload);
    },

    updateNoteProfile: (state, action) => {
      console.log("Updating note profile:", action.payload);
      const noteIndex = state.noteList.findIndex(note => note.noteId === action.payload.noteId);

      console.log("Note index found:", noteIndex);

      if (noteIndex !== -1) {
        state.noteList[noteIndex] = action.payload;
      } else {
        console.warn("Note not found for update:", action.payload.noteId);
      }
      
    },

     deleteNoteItem: (state, action) => {
      state.noteList = state.noteList.filter(note => note.noteId !== action.payload);
     }

     
  },
});

export const {
  setNoteList,
  setSelectedNote,
  updateNoteList,
  deleteNoteItem,
  updateNoteProfile,
} = noteSlice.actions;

export default noteSlice.reducer;
