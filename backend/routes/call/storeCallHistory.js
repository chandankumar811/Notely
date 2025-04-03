const express = require("express");
const router = express.Router();
const CallHistory = require("../../models/CallHistory"); 

// Search users by name or email
router.post("/store/call-history", async (req, res) => {
    try {
        const { callerId, receiverId, duration, callType, status, startTime, endTime } = req.body;
        console.log("Received call history data:", req.body);
        const callHistory = new CallHistory({
            callerId,
            receiverId,
            duration,
            callType,
            status,
            startTime: startTime ? new Date(startTime) : new Date(),
            endTime: endTime ? new Date(endTime) : new Date()
        });
        await callHistory.save();
        console.log("Call history saved:", callHistory);
        res.status(200).json({ message: "Call history stored successfully", callHistory });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
