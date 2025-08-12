const express = require("express");
const router = express.Router();
const Note = require("../../models/Note");

router.delete("/delete-note/:noteId", async (req, res) => {
    try {
        const { noteId } = req.params;

        const deletedNote = await Note.findOneAndDelete({ noteId: noteId });

        if (!deletedNote) {
            return res.status(404).json({ message: "Note not found" });
        }

        res.status(200).json({
            message: "Note deleted successfully",
            deletedNote
        });
    } catch (error) {
        console.error("Error deleting note", error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});

module.exports = router;
