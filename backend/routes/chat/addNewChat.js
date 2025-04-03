const express = require("express");
const router = express.Router();
const User = require("../../models/User"); 
const Chat = require("../../models/Chat"); 

// Search users by name or email
router.post("/new-chat", async (req, res) => {
    try {
        const { userId, peerId } = req.body;

        if (!userId || !peerId) {
            return res.status(400).json({ message: "Both userId and peerId are required." });
        }

        // Check if a chat already exists
        let chat = await Chat.findOne({ participants: { $all: [userId, peerId] } })
            .select('participants lastMessage updatedAt')
            .lean();

        if (!chat) {
            // Create a new chat
            chat = new Chat({ participants: [userId, peerId] });
            await chat.save();

            // Fetch the newly created chat
            chat = await Chat.findOne({ participants: { $all: [userId, peerId] } })
                .select('participants lastMessage updatedAt')
                .lean();
        }

        // Fetch peer user details
        const peer = await User.findOne({userId:peerId}).select('userId name email avatar').lean();
        if (!peer) {
            return res.status(404).json({ message: "Peer user not found." });
        }

        // Combine chat details with peer info
        const addedChat = { ...chat, peer };

        // console.log(addedChat);
        return res.status(200).json({ addedChat });

    } catch (error) {
        console.error("Error in /new-chat:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
