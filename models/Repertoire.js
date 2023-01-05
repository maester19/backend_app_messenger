const mongoose = require('mongoose');

const repertoireSchema = mongoose.Schema({
  _id: { type: String, required: true },
  userId: { type: String, ref: "User", required: true },
  contacts: [{ type: String, ref: "User", required: true }],
  createdAt: { type: Date, required: true },
}, { _id: false });

module.exports = mongoose.model('Repertoire', repertoireSchema); 