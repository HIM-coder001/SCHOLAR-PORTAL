const mongoose = require("mongoose");

const PaperSchema = new mongoose.Schema({
  title: { type: String, required: true },
  module: { type: String, required: true },
  instructor: { type: String, required: true },
  semester: { type: String, required: true },
  icon: { type: String, default: "" },
  iconBg: { type: String, default: "" },
  color: { type: String, default: "" },
  downloads: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  badges: [{ type: String }],
  description: { type: String, default: "" },
  imageUrl: { type: String, default: "" },
});

// Indices for performance optimization
PaperSchema.index({ module: 1 });
PaperSchema.index({ title: 1 });
PaperSchema.index({ instructor: 1 });

module.exports = mongoose.model("Paper", PaperSchema);
