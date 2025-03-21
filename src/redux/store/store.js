import { configureStore } from "@reduxjs/toolkit";
import userReducer  from "../slices/user/userSlice";
import chatReducer  from "../slices/chat/chatSlice";

export const store = configureStore({
  reducer: {
    user: userReducer ,
    chat: chatReducer
  },
});