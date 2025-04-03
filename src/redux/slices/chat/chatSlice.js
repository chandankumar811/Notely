import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedChat:null,
  chatList: [],
  messages: [],
  selectedCallReceiver:null,
  callStatus: 'idle',
  callHistory:[],
  selectedCallHistory:null,
  starChatList:[],
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
        updateDeletionChatList:(state,action) => {
        state.chatList = state.chatList.filter(chat => chat.peer.userId !== action.payload)
        },
        setMessages: (state, action) => {
        state.messages = action.payload;
        },
        addMessage: (state, action) => {
        if(state.selectedChat){
            state.messages.push(action.payload.message);
        }
        const chat = state.chatList.find((chat) => chat.peer.userId === action.payload.peerId);
        if (chat) {
            chat.lastMessage = action.payload.lastMessage
            chat.updatedAt = action.payload.message.timestamp;
        }
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
        setSelectedCallReceiver: (state, action) => {
            state.selectedCallReceiver = action.payload;
        },
        setCallStatus: (state, action) => {
            state.callStatus = action.payload;
        },
        setCallHistory:(state, action) =>{
            state.callHistory = action.payload;
        },
        updateCallHistory:(state, action) =>{
            state.callHistory.push(action.payload);
        },
        removeCallHistory: (state,action) =>{
            state.callHistory = state.callHistory.filter(call => call._id !== action.payload)
        },
        setSelectedCallHistory: (state, action) => {
            state.selectedCallHistory = action.payload;
        },
        setStarChatList: (state, action) => {
            state.starChatList = action.payload;
        },
        updateStarChatList: (state,action) =>{
            if(action.payload.isStar){
                const index = state.starChatList.findIndex(chat => chat.peer.userId === action.payload.chat.peer.userId);
                if(index === -1){
                    state.starChatList.push(action.payload.chat)
                }
                state.starChatList[index].starBy.push(action.payload.userId)
                const chat = state.chatList.find(chat => chat.peer.userId === action.payload.chat.peer.userId);
                chat.starBy = chat.starBy.push(action.payload.userId);
            }else{
                state.starChatList = state.starChatList.filter(starChat => starChat.peer.userId !== action.payload.chat.peer.userId);
                const chat = state.chatList.find(chat => chat.peer.userId === action.payload.chat.peer.userId);
                if (chat) {
                    chat.starBy = chat.starBy.filter(id => id !== action.payload.userId);
                }
            }
        }

    }
    });

export const { setSelectedChat,setChatList,updateChatList, updateDeletionChatList, setMessages, addMessage, removeMessage, updateMessage,setSelectedCallReceiver,setCallStatus,setCallHistory,updateCallHistory,removeCallHistory,setSelectedCallHistory,setStarChatList,updateStarChatList} = chatSlice.actions;

export default chatSlice.reducer;