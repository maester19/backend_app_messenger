const mongoose = require("mongoose")

const messageSchema = mongoose.Schema({
    _id: { type: String, required: true },
    userId: { type: String, ref: "User", required: true },
    receivedId: { type: String, ref: "User", required: true },
    content: { type: String, required: false },
    mediasUrl: [{ type: String, required: false }],
    answer : {
        type: { type: String, required: false },
        name: { type: String, required: false },
        content: { type: String, required: false },
        mediaUrl: { type: String, required: false }
    },
    receivedAt: { type: Date, required: false },
    readAt: { type: Date, required: false },
    updatedAt: { type: Date, default: Date.now() },
    createdAt: { type: Date, default: Date.now() },
}, { _id: false })

module.exports = mongoose.model("Message", messageSchema )