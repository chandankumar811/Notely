const express = require('express')
const router = express.Router()
const Note = require('../../models/Note')

router.delete('/delete-note-by-participant/:noteId/:userId', async(req, res) => {
    try {
        const {noteId, userId} = req.params;
    
        const note = await Note.findOne({noteId : noteId});
        if(!note){
            return res.status(404).json({error: 'Note not found'})
        }

        const leavedByIndex = note.leavedBy.findIndex(l => l.userId === userId);
        if(leavedByIndex === -1){
            return res.status(403).json({error: 'You are not in leaveBy list'})
        }

        note.leavedBy.splice(leavedByIndex, 1);
        await note.save();
        return res.status(200).json({message: 'You have deleted the note'});
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: 'Server error'})
    }

})

module.exports = router;
