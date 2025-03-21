const express = require("express");
const router = express.Router();
const User = require("../models/User"); 
const Chat = require("../models/Chat"); 

// Search users by name or email
router.get("/fetch/messages/:userId/:peerId", async (req, res) => {

    try {
        const {userId,peerId} = req.params;
        console.log(userId,peerId)
        const participants=[userId,peerId];
        const chat = await Chat.findOne({
          participants: { $all: participants, $size: participants.length },
        }).select('messages');
        console.log(chat)
    
        return res.status(200).json(chat)
      } catch (error) {
        console.error('Error fetching messages:', error);
        return { success: false, message: 'An error occurred while fetching messages.' };
      }
});

module.exports = router;
