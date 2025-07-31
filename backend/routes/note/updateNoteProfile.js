const express = require("express");
const router = express.Router();
const Note = require("../../models/Note");

router.put("/update-note-profile/:noteId", async (req, res) => {
    try {
        const { title, participant } = req.body;
        const { noteId } = req.params;
        if (!noteId || !title) {
            return res.status(400).json({ message: "Note ID and title are required" });
        }
        let note = await Note.findOne({ noteId });
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        } 

        note.title = title;
        note.participants = participant.map((p) => ({
            userId: p.userId,
            name: p.name,
            avatar: p.avatar,
            privilege: p.privilege || 'read'
        }))
        await note.save();
        return res.status(200).json({ message: "Note updated successfully", note });

    } catch (error) {
        console.error("Error in /update-note-profile:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
        
    }
})

module.exports = router;