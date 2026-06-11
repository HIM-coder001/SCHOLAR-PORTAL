const mongoose = require("mongoose");

const ChatMessageSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "ChatSession", required: true },
  sender: { type: String, enum: ["ai", "user"], required: true },
  text: { type: String, required: true },
  attachment: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ChatMessage", ChatMessageSchema);
