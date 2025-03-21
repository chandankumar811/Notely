const express = require("express");
const router = express.Router();
const User = require("../models/User"); 

// Search users by name or email
router.get("/get-requests/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        // Use regex to search for partial matches in name or email
        const user = await User.findOne({userId:userId});
        const requests = user.contactRequests;
        
        const contactRequests = await User.find({ userId: { $in: requests } }).select("userId name email avatar");
        console.log(contactRequests)
        res.json(contactRequests)
        
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
