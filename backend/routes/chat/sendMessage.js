const express = require("express");
const router = express.Router();
const User = require("../../models/User"); 
const Chat = require("../../models/Chat"); 

const MESSAGE_TYPES ={
    TEXT: 'text',
    IMAGE: 'image',
    VIDEO: 'video',
    DOCUMENT: 'document',
}
const getLastMessage = (type)=>{
    switch(type){
        case MESSAGE_TYPES.IMAGE:
            return `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/></svg> <span>image</span>`;
        case MESSAGE_TYPES.VIDEO:
            return `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg> <span>video</span>`;
        case MESSAGE_TYPES.DOCUMENT:
            return `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> <span>document</span>`;
    }
}

// Search users by name or email
router.post("/send-message", async (req, res) => {
    try {
        const {senderId,receiverId,message,attachment,messageType} = req.body;
        const chat = await Chat.findOne({ participants: { $all: [senderId, receiverId] } });
        const newMessage = {
            senderId,
            message,
            attachment,
            messageType
        }
        chat.messages.push(newMessage);
        const lastMessage = messageType === MESSAGE_TYPES.TEXT ? message : getLastMessage(messageType);
        chat.lastMessage = lastMessage;  
        await chat.save();
        const savedMessage = chat.messages[chat.messages.length - 1];
        res.status(200).json({message: savedMessage,lastMessage });

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
