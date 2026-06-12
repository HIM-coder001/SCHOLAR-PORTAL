const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const authMiddleware = require("../middleware/auth");

// GET all projects for user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error("Fetch Projects Error:", error);
    res.status(500).json({ message: "Server error fetching projects." });
  }
});

// POST create project
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, status, dueDate, color } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Project title is required." });
    }

    const project = new Project({
      userId: req.userId,
      title,
      description,
      status:  status  || "Planning",
      dueDate: dueDate || "",
      color:   color   ?? 0,
    });
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    console.error("Create Project Error:", error);
    res.status(500).json({ message: "Server error creating project." });
  }
});

// PUT update project
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, description, status, dueDate, color } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Project title is required." });
    }

    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { title, description, status, dueDate, color },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found or unauthorized." });
    }

    res.json(project);
  } catch (error) {
    console.error("Update Project Error:", error);
    res.status(500).json({ message: "Server error updating project." });
  }
});

// DELETE project
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!project) {
      return res.status(404).json({ message: "Project not found or unauthorized." });
    }
    res.json({ message: "Project deleted successfully." });
  } catch (error) {
    console.error("Delete Project Error:", error);
    res.status(500).json({ message: "Server error deleting project." });
  }
});

module.exports = router;
