const router = require("../chat/addNewChat");
const Note = require("../../models/Note");
const generateRandomString = (length) => {
    const chars = 'abcefghikmnstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < length; i++) {
      randomString += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return randomString;
  };


router.post("/new-note", async(req, res) => {
    try {
        const {creatorId, title, participant, } = req.body;
        if (!creatorId || !title) {
            return res.status(400).json({message: "Creator ID and title are required"});
        }

        console.log("Creating new note with data:", req.body);
    
        const noteId = generateRandomString(10);

        const note = new Note({
            noteId,
            creatorId,
            title,
            participants: participant.map((p) => ({
                userId: p.userId,
                name: p.name,
                avatar: p.avatar,
                privilege: p.privilege || 'read'
            }))
        })

        if(note) {
            await note.save();
            return res.status(200).json({message: "Note created successfully", note});
        }

    } catch (error) {
        console.error("Error in /new-note:", error);
        return res.status(500).json({message:"Server error", error: error.message});
    }
})

module.exports = router;