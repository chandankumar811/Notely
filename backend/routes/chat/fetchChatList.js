const express = require("express");
const router = express.Router();
const User = require("../../models/User"); 
const Chat = require("../../models/Chat"); 
const mongoose = require("mongoose");

// Search users by name or email
router.get("/get-chats/:userId/:size", async (req, res) => {

    try {
        const userId = req.params.userId;
        const size = req.params.size;
        const chats = await Chat.find({ participants: userId })
        .sort({ updatedAt: -1 }) // Sort by latest update
        .select('participants starBy lastMessage updatedAt messages deletionStamps')
        .lean();
        
        const userIds =[...new Set(chats.flatMap(chat => chat.participants))];
        const users = await User.find({userId:{$in:userIds}}).select('userId name email avatar').lean();

        let ChatList = chats.map(chat => {
            const peer = users.find(user => user.userId !== userId);

            // Find deletion checkpoint for the requesting user
                    const userDeletionEntry = chat.deletionStamps.find(entry => entry.userId === userId);
                    const checkPoint = userDeletionEntry ? userDeletionEntry.checkPoint : null;
            
                    // Convert checkPoint to ObjectId if it exists
                    const filteredMessages = checkPoint 
                        ? chat.messages.filter(msg => new mongoose.Types.ObjectId(msg._id) > new mongoose.Types.ObjectId(checkPoint))
                        : chat.messages;
                        if(filteredMessages.length > 0){
                          const {messages,deletionStamps,...finalChatList} = chat;
                          return {
                            ...finalChatList,
                            peer
                        }
                        }
            
        }).filter(Boolean);
        if(size==='star'){
          ChatList = ChatList.filter((chat)=>chat.starBy.includes(userId));
          console.log('star',ChatList)
        }
        console.log(ChatList);
        return res.status(200).json(ChatList);

      } catch (error) {
        res.status(400);
        throw new Error(error.message);
      }
});

module.exports = router;
