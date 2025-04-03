const mongoose = require('mongoose');

const callHistorySchema = new mongoose.Schema({
    callerId: { type: String, required: true },
    receiverId: { type: String, required: true },  
    duration: { type: Number, default: 0 }, 
    callType: { type: String, enum: ['audio', 'video'], required: true }, 
    status: { type: String, enum: ['Unanswered', 'Answered'], required: true }, 
    startTime: { type: Date, default: null },
    endTime: { type: Date, default: null },
    deletedBy:[{type:String,default:null}],
    timestamp: { type: Date, default: Date.now },
});

const CallHistory = mongoose.model('CallHistory', callHistorySchema, 'CallHistory');

module.exports = CallHistory;
