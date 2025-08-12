const dotenv = require('dotenv');
const express = require('express');
const http = require("http");
const cors = require("cors");
const socketIo = require("socket.io");
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { ExpressPeerServer } = require("peer");




const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());


const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });
const peerServer = ExpressPeerServer(server, { debug: true });
app.use("/peerjs", peerServer);


// Allow frontend to send cookies
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend URL
  credentials: true
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
.catch(err => console.error(err));



// routes
const updateUserAvatar = require('./routes/user/updateUserAvatar');
const updateUserDetail = require('./routes/user/updateUserDetail');

const googleLogin = require('./routes/auth/googleLogin');
const fetchUser = require('./routes/auth/fetchUser');
const userLogout = require('./routes/auth/userLogout');

const searchPeople = require('./routes/contact/searchPeople');
const requestPeople = require('./routes/contact/requestPeople');
const fetchRequests = require('./routes/contact/fetchRequests');
const acceptRequest = require('./routes/contact/acceptRequest');
const fetchContact = require('./routes/contact/fetchContact');
const toggleBlockUser = require('./routes/contact/toggleBlockUser');
const checkIsBlocked = require('./routes/contact/checkIsBlocked');
const fetchBlockedContacts = require('./routes/contact/fetchBlockedContacts');

const addNewChat = require('./routes/chat/addNewChat');
const fetchChatList = require('./routes/chat/fetchChatList');
const fetchMessages = require('./routes/chat/fetchMessages');
const sendMessage = require('./routes/chat/sendMessage');
const uploadFile = require('./routes/chat/uploadFile');
const toggleStarChat = require('./routes/chat/toggleStarChat');
const deleteChat = require('./routes/chat/deleteChat');

const storeCallHistory = require('./routes/call/storeCallHistory');
const fetchCallHistory = require('./routes/call/fetchCallHistory');
const deleteCallHistory = require('./routes/call/deleteCallHistory');
const deleteAllCallHistory = require('./routes/call/deleteAllCallHistory');

const path = require('path');
const authMiddleware = require('./middlewares/authMiddleware');

const addNewNote = require('./routes/note/addNewNote');
const fetchNoteList = require('./routes/note/fetchNoteList');
const updateNoteList = require('./routes/note/updateNoteProfile');
const updateNoteAvatar = require('./routes/note/updateNoteAvatar');
const deleteNote = require('./routes/note/deleteNote');
const leaveNote = require('./routes/note/leaveNote');
const deleteNoteByParticipant = require('./routes/note/deleteNoteByParticipant');



// api Routes
app.use('/api/user', updateUserAvatar);
app.use('/api/user', updateUserDetail);

app.use('/api/auth', googleLogin);
app.use('/api/auth', fetchUser);
app.use('/api/auth', userLogout);

app.use('/api/contact', searchPeople);
app.use('/api/contact', requestPeople);
app.use('/api/contact', fetchRequests);
app.use('/api/contact', acceptRequest);
app.use('/api/contact', fetchContact);
app.use('/api/contact', toggleBlockUser);
app.use('/api/contact', checkIsBlocked);
app.use('/api/contact', fetchBlockedContacts);

app.use('/api/chat', addNewChat);
app.use('/api/chat', fetchChatList);
app.use('/api/chat', fetchMessages);
app.use('/api/chat', sendMessage);
app.use('/api/chat', uploadFile);
app.use('/api/chat', toggleStarChat);
app.use('/api/chat', deleteChat);

app.use('/api/call', storeCallHistory);
app.use('/api/call', fetchCallHistory);
app.use('/api/call', deleteCallHistory);
app.use('/api/call', deleteAllCallHistory);

app.use('/api/note', addNewNote);
app.use('/api/note', fetchNoteList);
app.use('/api/note', updateNoteList);
app.use('/api/note', updateNoteAvatar);
app.use('/api/note', deleteNote);
app.use('/api/note', leaveNote);
app.use('/api/note', deleteNoteByParticipant);


// Socket.io server setup
const userSocketMap = new Map();
// Socket.io Connection
io.on("connection", (socket) => {
  // console.log("User connected:", socket.id);
  
  socket.on('map-userId', (userId) => {
    userSocketMap.set(userId, socket.id);
    // console.log("User mapped:", userId, "to socket:", socket.id);
  });

  socket.on('update-request-list',({contactId})=>{
    const contactSocketId = userSocketMap.get(contactId);
    console.log('requested')
    if (contactSocketId) {
      io.to(contactSocketId).emit("update-request-list");
    }
  })
  
  socket.on("new-message", ({ sender, receiverId, message ,lastMessage}) => {
    const receiverSocketId = userSocketMap.get(receiverId);
    console.log(sender, receiverId, message, lastMessage);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("received-message", {sender, message,lastMessage });
    }
  });
  
  
  socket.on('update-media-status', ({ receiverId, micStatus, videoStatus }) => {
    const receiverSocketId = userSocketMap.get(receiverId);
    console.log(receiverId, receiverSocketId,socket.id)
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('update-receiver-media-status', { micStatus, videoStatus });
    }
  });
  
  socket.on('accept-call', ({ callerId}) => {
    const callerSocketId = userSocketMap.get(callerId);
    if (callerSocketId) {
      io.to(callerSocketId).emit('call-accepted');
    }
  });

  // Example socket events for call management
socket.on('reject-call', ({callerId}) => {
  const callerSocketId = userSocketMap.get(callerId);
  io.to(callerSocketId).emit('call-rejected');
});

socket.on('cancel-call', ({receiverId}) => {
  const receiverSocketId = userSocketMap.get(receiverId);
  if(receiverSocketId){
  io.to(receiverSocketId).emit('call-cancelled');
}
});

socket.on('hangup-call', ({receiverId}) => {
  const receiverSocketId = userSocketMap.get(receiverId);
  if(receiverSocketId){
  io.to(receiverSocketId).emit('call-ended');
  }
});
socket.on('timeout-call', ({receiverId}) => {
  const receiverSocketId = userSocketMap.get(receiverId);
  if(receiverSocketId){
  io.to(receiverSocketId).emit('call-timedout');
  }
});

  
  // Handle user presence and online status
  socket.on('set-status', ({ userId, status }) => {
    // Broadcast to all connected clients
    socket.broadcast.emit('user-status-changed', { userId, status });
  });
  
  // Handle socket disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Find and remove the userId associated with this socket
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        // Notify other users about this user going offline
        socket.broadcast.emit('user-status-changed', { 
          userId, 
          status: 'offline' 
        });
        break;
      }
    }
  });
});

app.use("/files",authMiddleware,express.static(path.join(__dirname, 'files')));

server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
