const dotenv = require('dotenv');
const express = require('express');
const http = require("http");
const cors = require("cors");
const socketIo = require("socket.io");
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { ExpressPeerServer } = require("peer");

// routes
const googleLogin = require('./routes/googleLogin');
const fetchUser = require('./routes/fetchUser');
const userLogout = require('./routes/userLogout');

const searchPeople = require('./routes/searchPeople');
const requestPeople = require('./routes/requestPeople');
const fetchRequests = require('./routes/fetchRequests');
const acceptRequest = require('./routes/acceptRequest');
const searchContact = require('./routes/searchContact');

const addNewChat = require('./routes/addNewChat');
const fetchChatList = require('./routes/fetchChatList');
const fetchMessages = require('./routes/fetchMessages');
const sendMessage = require('./routes/sendMessage');

const path = require('path');

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
  connectTimeoutMS: 30000, 
  serverSelectionTimeoutMS: 30000,
}).then(() => console.log("MongoDB connected"))
.catch(err => console.error(err));

// api Routes
app.use('/api/auth', googleLogin);
app.use('/api/auth', fetchUser);
app.use('/api/auth', userLogout);

app.use('/api/contact', searchPeople);
app.use('/api/contact', requestPeople);
app.use('/api/contact', fetchRequests);
app.use('/api/contact', acceptRequest);
app.use('/api/contact', searchContact);

app.use('/api/chat', addNewChat);
app.use('/api/chat', fetchChatList);
app.use('/api/chat', fetchMessages);
app.use('/api/chat', sendMessage);



// Socket.io server setup
const userSocketMap = new Map();
// Socket.io Connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  
  socket.on('map-userId', (userId) => {
    userSocketMap.set(userId, socket.id);
    console.log("User mapped:", userId, "to socket:", socket.id);
  });
  
  socket.on("new-message", ({ receiverId, message }) => {
    const receiverSocketId = userSocketMap.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("received-message", { message });
    }
  });
  
  socket.on('update-receiver-media', ({ callerId, micStatus, videoStatus }) => {
    const callerSocketId = userSocketMap.get(callerId);
    if (callerSocketId) {
      io.to(callerSocketId).emit('update-receiver-media-status', { micStatus, videoStatus });
    }
  });
  
  socket.on('update-media-status', ({ receiverId, micStatus, videoStatus }) => {
    const receiverSocketId = userSocketMap.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('update-receiver-media-status', { micStatus, videoStatus });
    }
  });
  
  // Call signaling
  socket.on('call-user', ({ receiverId, callerId, callType }) => {
    const receiverSocketId = userSocketMap.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('incoming-call', { callerId, callType });
    } else {
      // If receiver is not online, notify caller
      const callerSocketId = userSocketMap.get(callerId);
      if (callerSocketId) {
        io.to(callerSocketId).emit('call-rejected', { 
          reason: 'User is offline'
        });
      }
    }
  });
  
  socket.on('accept-call', ({ callerId}) => {
    const callerSocketId = userSocketMap.get(callerId);
    if (callerSocketId) {
      io.to(callerSocketId).emit('call-accepted');
    }
  });
  
  socket.on('call-rejected', ({ callerId, receiverId, reason }) => {
    const callerSocketId = userSocketMap.get(callerId);
    if (callerSocketId) {
      io.to(callerSocketId).emit('call-rejected', { receiverId, reason });
    }
  });
  
  socket.on('call-ended', ({ peerId, userId }) => {
    const peerSocketId = userSocketMap.get(peerId);
    if (peerSocketId) {
      io.to(peerSocketId).emit('call-ended', { userId });
    }
  });
  
  // PeerJS signaling (optional if using PeerJS server separately)
  socket.on('relay-signal', ({ peerId, signal }) => {
    const peerSocketId = userSocketMap.get(peerId);
    if (peerSocketId) {
      io.to(peerSocketId).emit('signal-received', { 
        signal,
        from: socket.id
      });
    }
  });
  
  // Handle user typing indicators
  socket.on('typing', ({ receiverId, isTyping }) => {
    const receiverSocketId = userSocketMap.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('typing-status', {
        userId: socket.id,
        isTyping
      });
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

app.use("/files",express.static(path.join(__dirname, 'files')));

server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
