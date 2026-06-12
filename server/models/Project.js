const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    userId:      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title:       { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    status:      { type: String, enum: ["Planning", "In Progress", "Review", "Completed"], default: "Planning" },
    dueDate:     { type: String, default: "" },
    color:       { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", ProjectSchema);
