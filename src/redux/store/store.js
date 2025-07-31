import { configureStore } from "@reduxjs/toolkit";
import userReducer  from "../slices/user/userSlice";
import chatReducer  from "../slices/chat/chatSlice";
import noteReducer from "../slices/note/noteSlice";

export const store = configureStore({
  reducer: {
    user: userReducer ,
    chat: chatReducer,
    note: noteReducer
  },
});