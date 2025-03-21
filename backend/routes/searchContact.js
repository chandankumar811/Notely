const express = require("express");
const router = express.Router();
const User = require("../models/User"); 

// Search users by name or email
router.get("/search-contact/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ message: "Query parameter is required" });
        }

        // Use regex to search for partial matches in name or email
        const user = await User.findOne({ userId });
        const contacts = user.contacts;
        const users = await User.find({ userId: { $in: contacts } }).select("userId name email avatar");
        const filteredContact = users.filter(
            (contact) =>
              contact.name.toLowerCase().includes(query.toLowerCase()) ||
              contact.email.toLowerCase().includes(query.toLowerCase())
          );
          console.log('search ',filteredContact)
        res.json(filteredContact);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
