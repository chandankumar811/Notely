import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedChat:null,
  chatList: [],
  messages: [],
  callStatus: 'idle',
};

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setSelectedChat: (state, action) => {
        state.selectedChat = action.payload;
        },
        setChatList: (state, action) => {
        state.chatList = action.payload;
        },
        updateChatList: (state, action) => {
        state.chatList.push(action.payload);
        },
        setMessages: (state, action) => {
        state.messages = action.payload;
        },
        addMessage: (state, action) => {
        state.messages.push(action.payload);
        },
        removeMessage: (state, action) => {
        state.messages.filter((message) => message._id !== action.payload);
        },
        updateMessage: (state, action) => {
        const { _id, text } = action.payload;
        const message = state.messages.find((message) => message._id === _id);
        if (message) {
            message.message = text;
        }
        },
        setCallStatus: (state, action) => {
            state.callStatus = action.payload;
        },
    }
    });

export const { setSelectedChat,setChatList,updateChatList, setMessages, addMessage, removeMessage, updateMessage,setCallStatus} = chatSlice.actions;

export default chatSlice.reducer;