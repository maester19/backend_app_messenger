const mongoose = require('mongoose');

const conversationSchema = mongoose.Schema({
  _id: { type: String, required: true },
  ownerId: [{ type: String, ref: "User", required: true }],
  listMsg: [{ type: String, ref: "Message", required: true }],
  createdAt: { type: Date, required: true },
}, { _id: false });

module.exports = mongoose.model('Conversation', conversationSchema); 