const mongoose = require('mongoose');

const participant = new mongoose.Schema({
    userId: { type: String, required: true, ref: 'User' },
    name: { type: String, required: true },
    avatar: { type: String, default: '' },
    privilege: { type: String, enum: ['write', 'read'], default: 'read' },
})

const leavedBy = new mongoose.Schema({
    userId: { type: String, required: true, ref: 'User' },
    name: { type: String, required: true },
    avatar: { type: String, default: '' },
})

const noteSchema = new mongoose.Schema({
    avatar: { type: String, default: '' },
    noteId: { type: String, required: true, unique: true },
    creatorId: {type: String, required: true, ref: 'User'},
    title: { type: String, required: true },
    participants: [ participant ],
    leavedBy: [leavedBy],
    content: { type: String },
    createdAt: { type: Date, default: Date.now },
}, {timestamps: true});

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;