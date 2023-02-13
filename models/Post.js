const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  _id: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String, required: true },
  userId: { type: String, required: true },
  createdAt: { type: Date, required: true },
});

module.exports = mongoose.model('Post', postSchema); 