const express = require("express");
const router = express.Router();
const User = require("../../models/User"); 

// Search users by name or email
router.post("/accept-request/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const { query } = req.body;  // Use req.body instead of req.query for a POST request

        if (!query) {
            return res.status(400).json({ message: "Query parameter is required" });
        }

        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const peer = await User.findOne({ userId: query });
        if (!peer) {
            return res.status(404).json({ message: "Requested user not found" });
        }

        // Check if already sent
        if (peer.contacts.includes(user.userId) && user.contacts.includes(peer.userId)) {
            return res.status(400).json({ message: "already in contact" });
        }

        // Push the ObjectId instead of the whole object
        user.contacts.push(peer.userId);
        peer.contacts.push(user.userId);
        user.contactRequests = user.contactRequests.filter(contact => contact !== peer.userId);
        await user.save();
        await peer.save();
        res.status(200).json({ message: "request accepted" });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
