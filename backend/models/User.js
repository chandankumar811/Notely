const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    avatar: {
        type: String,
        required:true
    },
    googleId: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: false
    },
    contacts: [{
        type: String,
        ref: 'User'
    }],
    contactRequests: [{
        type: String,
        ref: 'User'
    }],
    blockedContacts: [{
        type: String,
        ref: 'User'
    }],
    starChats: [{
        type: String,
        ref: 'User'
    }]
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;