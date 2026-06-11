const express = require("express");
const router = express.Router();
const Paper = require("../models/Paper");
const authMiddleware = require("../middleware/auth");

// GET papers with optional filters and search
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { department, course, year, semester, search } = req.query;
    let query = {};

    // Apply filters if provided and they aren't default "All" values
    if (department && department !== "All" && department !== "Select Department") {
      query.department = department; // We will seed this if needed, or query modules
    }
    
    if (year && year !== "All") {
      query.semester = new RegExp(year, "i"); // E.g. search "2023" inside semester "2023 Fall"
    }

    if (semester && semester !== "All") {
      query.semester = new RegExp(semester.split(" ")[0], "i"); // E.g. "Fall" inside "2023 Fall"
    }

    // Text search query across title, module, or instructor
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { module: { $regex: search, $options: "i" } },
        { instructor: { $regex: search, $options: "i" } },
      ];
    }

    const papers = await Paper.find(query);
    res.json(papers);
  } catch (error) {
    console.error("Fetch Papers Error:", error);
    res.status(500).json({ message: "Server error fetching papers list." });
  }
});

// POST increment download count for a paper
router.post("/:id/download", authMiddleware, async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);
    if (!paper) {
      return res.status(404).json({ message: "Paper not found." });
    }

    paper.downloads += 1;
    await paper.save();

    res.json({ message: "Download count incremented.", downloads: paper.downloads });
  } catch (error) {
    console.error("Increment Downloads Error:", error);
    res.status(500).json({ message: "Server error updating download metrics." });
  }
});

module.exports = router;
