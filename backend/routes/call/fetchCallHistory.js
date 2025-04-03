
const express = require("express");
const router = express.Router();
const CallHistory = require("../../models/CallHistory"); 
const User = require("../../models/User");

// Search users by name or email
router.get("/get/call-history/:userId", async (req, res) => {
    
    try {
    const { userId } = req.params;

    // Fetch call history
    const calls = await CallHistory.find({
        $or: [{ callerId: userId }, { receiverId: userId }],
        deletedBy: { $ne: userId } 
    }).sort({ timestamp: -1 });

    // Fetch user details for each call
    const populatedCalls = await Promise.all(
        calls.map(async (call) => {
            const caller = await User.findOne({ userId: call.callerId }).select("userId name avatar");
            const receiver = await User.findOne({ userId: call.receiverId }).select("userId name avatar");
            const { callerId, receiverId, ...filteredCall } = call._doc;
            return {
                ...filteredCall,  
                caller: caller || null, 
                receiver: receiver || null
            };
        })
    );
    console.log("Fetched call history:", populatedCalls);

    return res.status(200).json(populatedCalls);
} catch (error) {
    console.error("Error fetching call history:", error);
    res.status(500).json({ message: "Server error", error: error.message });
}
});

module.exports = router;
