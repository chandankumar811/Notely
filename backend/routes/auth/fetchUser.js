const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const User = require('../../models/User')

router.get('/get-me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({userId:req.user.userId})
    if(!user){
      return res.json({user:{}})
    }
    res.json({ user: {
      userId: user.userId,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      phoneNumber: user.phoneNumber,
      address: user.address
    } }); 
  } catch (error) {
      return res.status(500).json({message:'internal server error'})
  }
  
});

module.exports = router;
