const express = require('express');
const router = express.Router();

router.post('/logout', (req, res) => {
    res.clearCookie('token', { httpOnly: true, sameSite: 'Lax' });
    res.json({ message: 'Logged out successfully' });
  });

module.exports = router;
