const mongoose = require('mongoose');

const statutSchema = mongoose.Schema({
  _id: { type: String, required: true },
  userId: { type: String, ref: "User", required: true },
  color: { type: String, required: true },
  content: { type: String, required: true },
  mediaUrl: { type: String, required: true },
  viewList: [{ type: String, required: true }],
  createdAt: { type: Date, required: true },
}, { _id: false });

module.exports = mongoose.model('Statut', statutSchema); 