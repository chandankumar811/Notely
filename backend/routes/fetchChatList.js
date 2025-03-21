const express = require("express");
const router = express.Router();
const User = require("../models/User"); 
const Chat = require("../models/Chat"); 

// Search users by name or email
router.get("/get-chats/:userId", async (req, res) => {

    try {
        const userId = req.params.userId;
        const chats = await Chat.find({ participants: userId })
        .sort({ updatedAt: -1 }) // Sort by latest update
        .select('participants lastMessage updatedAt')
        .lean();
        
        const userIds =[...new Set(chats.flatMap(chat => chat.participants))];
        const users = await User.find({userId:{$in:userIds}}).select('userId name email avatar').lean();
        const ChatList = chats.map(chat => {
            const peer = users.find(user => user.userId !== userId);
            return {
                ...chat,
                peer
            }
        });
        // console.log(ChatList);
        return res.json(ChatList);

      } catch (error) {
        res.status(400);
        throw new Error(error.message);
      }
});

module.exports = router;
