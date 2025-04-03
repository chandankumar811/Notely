const express = require("express");
const router = express.Router();
const User = require("../../models/User");

router.post('/block-user', async (req, res) => {
    try {
        const { userId, peerId } = req.body;

        if (!userId || !peerId) {
            return res.status(400).json({ message: "userId and peerId are required" });
        }

        // Find the user
        const user = await User.findOne({ userId });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        let hasBlocked;
        
        if (user.blockedContacts.includes(peerId)) {
            // Unblock user
            await User.findOneAndUpdate(
                { userId },
                { $pull: { blockedContacts: peerId } },
                { new: true }
            );
            hasBlocked = false;
        } else {
            // Block user
            await User.findOneAndUpdate(
                { userId },
                { $addToSet: { blockedContacts: peerId } },
                { new: true }
            );
            hasBlocked = true;
        }

        return res.status(200).json({ hasBlocked });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
