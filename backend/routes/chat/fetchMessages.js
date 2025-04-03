const express = require("express");
const router = express.Router();
const Chat = require("../../models/Chat");
const mongoose = require("mongoose");

router.get("/fetch/messages/:userId/:peerId", async (req, res) => {
    try {
        const { userId, peerId } = req.params;
        console.log(userId, peerId);

        const participants = [userId, peerId];

        const chat = await Chat.findOne({
            participants: { $all: participants, $size: participants.length },
        }).select('messages deletionStamps');

        if (!chat) {
            return res.status(404).json({ error: 'Chat not found' });
        }

        // Find deletion checkpoint for the requesting user
        const userDeletionEntry = chat.deletionStamps.find(entry => entry.userId === userId);
        const checkPoint = userDeletionEntry ? userDeletionEntry.checkPoint : null;

        // Convert checkPoint to ObjectId if it exists
        const filteredMessages = checkPoint 
            ? chat.messages.filter(msg => new mongoose.Types.ObjectId(msg._id) > new mongoose.Types.ObjectId(checkPoint))
            : chat.messages;

        return res.status(200).json({ messages: filteredMessages });

    } catch (error) {
        console.error('Error fetching messages:', error);
        return res.status(500).json({ error: 'An error occurred while fetching messages.' });
    }
});

module.exports = router;
