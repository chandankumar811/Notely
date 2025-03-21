const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: { type: String, required: true },
  message: { type: String, default: null },  
  attachment: { type: String, default: null }, 
  seenBy: [{ type: String, default: null}],
  timestamp: { type: Date, default: Date.now },
});

const chatSchema = new mongoose.Schema({
    participants: [{ type: String, required: true }],
    messages: [messageSchema],
    lastMessage: { type: String, default: null },
    deletedBy: [{ type: String }], 
    updatedAt: { type: Date, default: Date.now },
  });
  
  const Chat = mongoose.model('Chat', chatSchema, 'chats');
  
  module.exports = Chat;