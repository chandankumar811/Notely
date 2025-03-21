const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/get-me', authMiddleware, (req, res) => {
  res.json({ user: {
    userId: req.user.userId,
    name: req.user.name,
    email: req.user.email,
    avatar: req.user.avatar,
  } }); 
});

module.exports = router;
