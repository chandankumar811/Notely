const express = require('express');
const CallHistory = require('../../models/CallHistory')
const router = express.Router();

router.delete('/delete-call-history/:userId/:callId',async (req,res)=>{
    try {
        const { userId, callId } = req.params;
        const call = await CallHistory.findById(callId);

        if (!call) {
            return res.status(404).json({ message: 'Call history not found' });
        }

        if (!call.deletedBy.includes(userId)) {
            call.deletedBy.push(userId);
            await call.save();
        }

        // If both users have deleted the call, remove it from DB
        if (call.deletedBy.includes(call.callerId) && call.deletedBy.includes(call.receiverId)) {
            await CallHistory.findByIdAndDelete(callId);
        }

        res.status(200).json({ message: 'Call history deleted for the user' });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

module.exports = router;