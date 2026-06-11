const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  institution: { type: String, default: "" },
  course: { type: String, default: "" },
  messageCount: { type: Number, default: 1000 },
  messageLimit: { type: Number, default: 1000 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);
