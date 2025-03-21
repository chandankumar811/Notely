const express = require('express')
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const axios = require('axios');


const generateRandomString = (length) => {
    const chars = 'abcefghikmnstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < length; i++) {
      randomString += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return randomString;
  };

router.post('/google-login', async (req, res) => {
    const { access_token } = req.body;
    console.log(access_token);
      try {
    // Fetch user info from Google
    const googleResponse = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`);
    const userInfo = googleResponse.data;
    console.log(userInfo);
    
    const userId = `${userInfo.name.toLowerCase().replace(/\s/g, '_')}_${generateRandomString(6)}`;

    let user = await User.findOne({ email:userInfo.email });
    if (!user) {
      user = new User({
        userId,
        name: userInfo.name,
        email: userInfo.email,
        avatar: userInfo.picture,
        googleId: userInfo.id,
        phoneNumber: '',
      });
      await user.save();
    }

      user = await User.findOne({ email: userInfo.email });
      const userData = user.toObject();
      delete userData.googleId;

    // Generate JWT token
    const token = jwt.sign(
      { userId:user.userId, email: userInfo.email, name: userInfo.name, avatar: userInfo.picture },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // 1-week session
    );

    // Set token in HttpOnly cookie
    res.cookie('token', token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 1 week
    });

      
      return res.status(200).json({ message: 'Login Successful', user: {
        userId:userData.userId,
        name: userData.name,
        email: userData.email,
        avatar: userData.avatar,} });

  } catch (error) {
    console.error('Google OAuth error:', error);
    res.status(500).json({ message: 'Authentication failed' });
  }

});
module.exports = router