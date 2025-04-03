const express = require('express');
const CallHistory = require('../../models/CallHistory')
const router = express.Router();

router.delete('/delete-all-call-history/:userId',async (req,res)=>{
    try {
        const { userId } = req.params;
        const callIdArr = req.body.callIdArr;
        console.log(callIdArr)

        if (!Array.isArray(callIdArr) || callIdArr.length === 0) {
            return res.status(400).json({ message: 'No call IDs provided' });
        }

        // Fetch all calls that match the IDs
        const calls = await CallHistory.find({ _id: { $in: callIdArr } });

        if (!calls.length) {
            return res.status(404).json({ message: 'No matching call history found' });
        }

        // Mark calls as deleted by this user
        for (let call of calls) {
            if (!call.deletedBy.includes(userId)) {
                call.deletedBy.push(userId);
                await call.save();
            }
        }

        // Permanently delete calls where both users have deleted them
        await CallHistory.deleteMany({
            _id: { $in: callIdArr },
            $expr: { $setEquals: ["$deletedBy", ["$callerId", "$receiverId"]] }
        });
        res.status(200).json({ message: 'Call history deleted for the user' });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

module.exports = router;