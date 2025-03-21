const express = require("express");
const router = express.Router();
const User = require("../models/User"); 
const Chat = require("../models/Chat"); 

// Search users by name or email
router.post("/send-message", async (req, res) => {
    try {
        const {senderId,receiverId,message,attachment} = req.body;
        const chat = await Chat.findOne({ participants: { $all: [senderId, receiverId] } });
        const newMessage = {
            senderId,
            message,
            attachment
        }
        chat.messages.push(newMessage);
        await chat.save();
        const savedMessage = chat.messages[chat.messages.length - 1];
        res.status(200).json({message: savedMessage });

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
