const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const authMiddleware = require("../middleware/auth");

// GET all notes for user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    console.error("Fetch Notes Error:", error);
    res.status(500).json({ message: "Server error fetching notes." });
  }
});

// POST create note
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, content, tag, color } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Note title is required." });
    }

    const note = new Note({
      userId: req.userId,
      title,
      content,
      tag:   tag   || "Note",
      color: color ?? 0,
    });
    await note.save();

    res.status(201).json(note);
  } catch (error) {
    console.error("Create Note Error:", error);
    res.status(500).json({ message: "Server error creating note." });
  }
});

// PUT update note
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, content, tag, color } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Note title is required." });
    }

    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { title, content, tag, color },
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ message: "Note not found or unauthorized." });
    }

    res.json(note);
  } catch (error) {
    console.error("Update Note Error:", error);
    res.status(500).json({ message: "Server error updating note." });
  }
});

// DELETE note
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!note) {
      return res.status(404).json({ message: "Note not found or unauthorized." });
    }

    res.json({ message: "Note deleted successfully." });
  } catch (error) {
    console.error("Delete Note Error:", error);
    res.status(500).json({ message: "Server error deleting note." });
  }
});

module.exports = router;
