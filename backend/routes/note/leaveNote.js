const express = require('express');
const router = express.Router();
const Note = require("../../models/Note");

router.delete('/leave-note/:noteId/:userId', async(req, res) => {
   try {
     const {noteId, userId} = req.params;
 
     const note = await Note.findOne({noteId : noteId});
     if(!note){
         return res.status(404).json({error: 'Note not found'})
     }
 
     const participantIndex = note.participants.findIndex(p => p.userId === userId);
     if(participantIndex === -1){
         return res.status(403).json({error: 'You are not a participant of this note'})
     }
 
     const participant = note.participants[participantIndex];
 
     if(!note.leavedBy.some(l => l.userId === userId)){
         note.leavedBy.push({
             userId : participant.userId,
             name: participant.name,
             avatar: participant.avatar
         });
     }
 
     note.participants.splice(participantIndex, 1);
 
     await note.save();
 
     return res.status(200).json({message: 'You have left the note'});
   } catch (error) {
    console.error(error);
     return res.status(500).json({error: 'Server error'});
   }
})

module.exports = router