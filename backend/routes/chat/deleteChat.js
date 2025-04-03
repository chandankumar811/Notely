const express = require('express');
const router = express.Router();
const Chat = require('../../models/Chat'); 


router.delete('/delete-chat', async (req, res) => {
    try {
        const {userId, participants} = req.body; 
    
        const chat = await Chat.findOne({participants: {$all : participants}});
        if (!chat) {
          return res.status(404).json({ error: 'Chat not found' });
        }
        
        const existingEntryIndex = chat.deletionStamps.findIndex(
          (entry) => entry.userId === userId
        );
    
        if (existingEntryIndex === -1) {
          chat.deletionStamps.push({
            userId,
            checkPoint:chat.messages[chat.messages.length - 1]._id,
            timestamp: new Date(),
          });
        } else{
            chat.deletionStamps[existingEntryIndex].checkPoint = chat.messages[chat.messages.length - 1]._id;
            chat.deletionStamps[existingEntryIndex].timestamp = new Date();
        }
          
        if(chat.deletionStamps.length === 2){
            const checkPointIndex1 = chat.messages.findIndex((message) => message._id.equals(chat.deletionStamps[0].checkPoint));
            const checkPointIndex2 = chat.messages.findIndex((message) => message._id.equals(chat.deletionStamps[1].checkPoint));

            const deletionCount = Math.min(checkPointIndex1,checkPointIndex2)+1

            if (deletionCount > 0) {
            chat.messages.splice(0,deletionCount)
            }
        }
        
        if (chat.starBy.includes(userId)) {
            chat.starBy = chat.starBy.filter(id => id !== userId);
        }
        // Save the chat
        await chat.save();
    
        res.status(200).json({ message: 'Chat deleted' });
      } catch (error) {
        console.error('Failed to delete chat:', error);
        res.status(500).json({ error: 'Failed to delete chat' });
      }
    });

  module.exports = router;