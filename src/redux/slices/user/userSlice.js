import { createSlice } from "@reduxjs/toolkit";
import { set } from "mongoose";

const initialState = {
  uid: "",
  name: "",
  email: "",
  avatar: "",
  phoneNumber: "",
  address: "",
  onlineContacts: [],
  blockedContacts: [],
  isAuthenticated: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.uid = action.payload.uid;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.avatar = action.payload.avatar;
      state.phoneNumber = action.payload.phoneNumber;
      state.address = action.payload.address;
      state.isAuthenticated = action.payload.isAuthentication;
    },
    updateUserPhoneNumber: (state, action) => {
      state.phoneNumber = action.payload;
    },
    updateUserAvatar: (state, action) => {
      state.avatar = action.payload;
    },
    updateUserAddress: (state, action) => {
      state.address = action.payload;
    },
    setOnlineContacts: (state, action) => {
      set.onlineContacts.push(action.payload);
    },
    removeOnlineContacts: (state, action) => {
      state.onlineContacts.filter(
        (contact) => contact.uid !== action.payload
      );
    },
    setBlockedContacts: (state, action) => {
      state.blockedContacts = action.payload;
    },
    updateBlockedContacts: (state, action) => {
      if (action.payload.isBlocked) {
        state.blockedContacts.push(action.payload.peer);
        console.log("Blocked Contacts", state.blockedContacts);
      } else {
        state.blockedContacts = state.blockedContacts.filter(
          (contact) => contact.uid !== action.payload.peer.uid
        );
        console.log("Unblocked Contacts", state.blockedContacts);
      }
    },
    setSocketConnection: (state, action) => {
      state.socketConnection = action.payload;
    },
    logout: (state) => {
      state.uid = "";
      state.name = "";
      state.email = "";
      state.avatar = "";
      state.phoneNumber = "";
      state.address = "";
      state.onlineContacts = [];
      state.blockedContacts = [];
      state.isAuthenticated = false;
    },
  },
});

export const {
  setUser,
  updateUserPhoneNumber,
  updateUserAvatar,
  updateUserAddress,
  setOnlineContacts,
  removeOnlineContacts,
  setBlockedContacts,
  updateBlockedContacts,
  setSocketConnection,
  logout,
} = userSlice.actions;
 
export default userSlice.reducer;