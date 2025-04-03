const express = require("express");
const router = express.Router();
const User = require("../../models/User");

router.get('/check-blocked/:userId/:peerId',async (req,res)=>{
    try {
        const {userId,peerId} = req.params;
        console.log(userId,peerId)

        const user = await User.findOne({userId:peerId});
        if(user.blockedContacts.includes(userId)){
            console.log('blocked')
            return res.status(200).json({isBlocked:true})
        }
        console.log('unblocked')
        return res.status(200).json({isBlocked:false})
        
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
})

module.exports = router;