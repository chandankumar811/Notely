const express = require('express');
const router = express.Router();
const { upload } = require('../../middlewares/multerMiddleware');
const fs = require('fs');
const path = require('path');
// Make sure to import your Note model here
const Note = require('../../models/Note');
const { uploadOnCloudinary } = require('../../utils/cloudinary');

// Add multer middleware here
router.post('/update-note-avatar', upload.single('file'), async (req, res) => {
  const { noteId } = req.body;
  
  if(!noteId){
    return res.status(400).json({ error: 'Note ID is required' });
  }

  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    return res.status(400).json({ error: 'Avatar file is required' });
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar) {
    return res.status(500).json({ error: 'Failed to upload avatar to Cloudinary' });
  }

  try {
    const note = await Note.findByIdAndUpdate(noteId , {$set: {avatar: avatar.url}}, { new: true });

    return res.status(200).json({
      message: 'Avatar updated successfully',
      note
    });
  
  } catch (error) {
    console.error('Error updating note avatar:', error);
    return res.status(500).json({ error: 'Failed to update note avatar' });
  }
   
});

module.exports = router;
