const express = require('express');
const User = require('../../models/User')
const router = express.Router();

router.post('/update-user-detail', async (req,res)=>{
    try {
        const {userId,phone,address} = req.body;

        const user = await User.findOne({userId});

        if(!user){
            return res.status(404).json({messgae:'user not found'})
        }

        if(phone){
            user.phoneNumber=phone;
        }
        if(address){
            user.address = address;
        }
        
        await user.save()
        return res.status(200).json({success:true})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

module.exports = router;