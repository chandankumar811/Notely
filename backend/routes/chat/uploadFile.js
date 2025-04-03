const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();


// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const userId = req.body.userId;
        const uploadDir = path.join(__dirname, '../files/chat-files',userId); // Correct path

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

      cb(null, uploadDir); 
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '_' +file.originalname)
    }
  });
  
  const upload = multer({storage});

  router.post('/upload-file',upload.single('file'),(req,res)=>{
    const userId = req.body.userId;
    const file = req.file;
    console.log(userId,file)
    const fileUrl = file?`http://localhost:5000/files/chat-files/${userId}/${file.filename}`:null;
    res.status(200).json({fileUrl});

  })

  module.exports = router;