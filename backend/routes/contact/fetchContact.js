const express = require("express");
const router = express.Router();
const User = require("../../models/User"); 

// Search users by name or email
router.get("/fetch-contact/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        
        const user = await User.findOne({ userId });
        const contacts = user.contacts;
        const userContacts = await User.find({ userId: { $in: contacts } }).select("userId name email avatar");
        return res.status(200).json(userContacts);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
