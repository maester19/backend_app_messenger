const mongoose = require("mongoose")

const messageSchema = mongoose.Schema({
    _id: { type: String, required: true },
    userId: { type: String, ref: "User", required: true },
    recevedId: { type: String, ref: "User", required: true },
    content: { type: String, required: false },
    imageUrl: { type: String, required: false },
    updatedAt: { type: Date, default: Date.now() },
    createdAt: { type: Date, default: Date.now() },
}, { _id: false })

module.exports = mongoose.model("Message", messageSchema )