const express = require("express");
const router = express.Router();
const User = require("../../models/User"); 

// Search users by name or email
router.get("/new/people/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ message: "Query parameter is required" });
        }

        const user = await User.findOne({userId});
        // Use regex to search for partial matches in name or email
        const users = await User.find({
            $or: [
                { name: { $regex: query, $options: "i" } }, // Case-insensitive search
                { email: { $regex: query, $options: "i" } },
            ],
        }).select("userId name email avatar");

        // console.log(users);
        const myContacts = user.contacts;
        const filteredUsers = users.filter(user => user.userId !== userId);
        const uniqueElements = filteredUsers.filter(item => !myContacts.includes(item.userId));
        res.json(uniqueElements);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
