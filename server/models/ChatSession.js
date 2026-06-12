const mongoose = require("mongoose");

const ChatSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  documentContext: { type: String, default: "" },
  documentName: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ChatSession", ChatSessionSchema);
