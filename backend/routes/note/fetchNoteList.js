const express = require("express");
const router = express.Router();
const Note = require("../../models/Note");

router.get("/get/note-list/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    // console.log("Fetching note list for userId:", userId);
    // Fetch notes created by the user
    const notes = await Note.find({
      $or: [{ creatorId: userId }, { "participants.userId": userId }, {"leavedBy.userId" : userId}],
    });

    // console.log("Fetched note list:", notes);
    if (!notes || notes.length === 0) {
      return res.status(404).json({ message: "No notes found" });
    }
    return res.status(200).json(notes);
  } catch (error) {
    console.error("Error fetching note list:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
