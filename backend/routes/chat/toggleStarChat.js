const express = require("express");
const router = express.Router(); 
const Chat = require("../../models/Chat"); 

// Search users by name or email
router.post("/toggle-star-chat", async (req, res) => {
    try {
        const {userId, participants } = req.body;
        console.log(userId,participants)

        if (!userId || !participants) {
            return res.status(400).json({ error: "Missing required fields." });
        }

        const chat = await Chat.findOne({ participants: { $all: participants } });
        if (!chat) {
            return res.status(404).json({ error: "Chat not found." });
        }

        if (chat.starBy.includes(userId)) {
            chat.starBy = chat.starBy.filter(id => id !== userId);
        } else {
            chat.starBy.push(userId);
        }

        await chat.save();
        return res.status(200).json({ message: "Message star status updated." });
    } catch (error) {
        console.error("Error in star new-chat:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
