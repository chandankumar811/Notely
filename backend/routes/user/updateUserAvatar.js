const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const User = require('../../models/User')


// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const userId = req.body.userId;
        const uploadDir = path.join(__dirname, '../files/avatars',userId); // Correct path

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

      cb(null, uploadDir); 
    },
    filename: (req, file, cb) => {
        const userId = req.body.userId;
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}_${userId}_profile_picture${ext}`);
    }
  });
  
  const upload = multer({storage});

  router.post('/update-user-avatar',upload.single('file'),async (req,res)=>{
    try {
        const userId = req.body.userId;
        const file = req.file;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const fileUrl = `http://localhost:5000/files/avatars/${userId}/${file.filename}`;

        const user = await User.findOne({userId});
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.avatar = fileUrl;
        await user.save();

        return res.status(200).json({ fileUrl });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
    

  })

  module.exports = router;