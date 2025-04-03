const express = require("express");
const router = express.Router();
const User = require("../../models/User");

router.get('/fetch-blocked/:userId',async (req,res)=>{
    try {
        const {userId} = req.params;

        const user = await User.findOne({userId});
        if(!user){
            return res.status(404).json({message:'message not found!!'})
        }
        const blockedContacts = await User.find({ userId: { $in: user.blockedContacts } }).select("userId name email avatar");
        return res.status(200).json({blockedContacts})
        
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
})

module.exports = router;