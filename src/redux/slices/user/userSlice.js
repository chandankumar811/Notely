import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId:'',
  name: '',
  email:'',
  avatar: '',
  onlineContacts: [],
  socketConnection: null,
  isAuthenticated: false,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
        state.userId = action.payload.userId;
        state.name = action.payload.name;
        state.email = action.payload.email;
        state.avatar = action.payload.avatar;
        state.isAuthenticated = true;
        },
        setOnlineContacts: (state, action) => {
        state.onlineContacts.push(action.payload);
        },
        removeOnlineContacts: (state, action) => {
        state.onlineContacts.filter((contact) => contact.userId !== action.payload);
        },
        setSocketConnection: (state, action) => {
        state.socketConnection = action.payload;
        },
        logout: (state) => {
        state.userId = '';
        state.name = '';
        state.email = '';
        state.avatar = '';
        state.onlineContacts = [];
        state.socketConnection = null;
        state.isAuthenticated = false;
        },
    },
    });

export const { setUser, setOnlineContacts, removeOnlineContacts, setSocketConnection, logout } = userSlice.actions;

export default userSlice.reducer;