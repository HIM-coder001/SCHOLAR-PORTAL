const express = require("express");
const router = express.Router();
const ChatSession = require("../models/ChatSession");
const ChatMessage = require("../models/ChatMessage");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");

// GET all sessions for logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const sessions = await ChatSession.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(sessions);
  } catch (error) {
    console.error("Fetch Sessions Error:", error);
    res.status(500).json({ message: "Server error fetching chat sessions." });
  }
});

// POST create a new session
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Session title is required." });
    }

    const session = new ChatSession({
      userId: req.userId,
      title,
    });
    await session.save();

    // Auto-create a welcome message from AI
    const welcomeMessage = new ChatMessage({
      sessionId: session._id,
      sender: "ai",
      text: `Starting new research session: "${title}". How can I help you extract details, summarize text or cite papers today?`
    });
    await welcomeMessage.save();

    res.status(201).json(session);
  } catch (error) {
    console.error("Create Session Error:", error);
    res.status(500).json({ message: "Server error creating new session." });
  }
});

// GET messages in a session
router.get("/:sessionId/messages", authMiddleware, async (req, res) => {
  try {
    const session = await ChatSession.findOne({ _id: req.params.sessionId, userId: req.userId });
    if (!session) {
      return res.status(403).json({ message: "Access denied or session not found." });
    }

    const messages = await ChatMessage.find({ sessionId: req.params.sessionId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    console.error("Fetch Messages Error:", error);
    res.status(500).json({ message: "Server error fetching messages." });
  }
});

// POST message to a session (Send User message & auto-generate mock AI response)
router.post("/:sessionId/messages", authMiddleware, async (req, res) => {
  try {
    const { text, attachment } = req.body;
    
    // Check if session exists and belongs to user
    const session = await ChatSession.findOne({ _id: req.params.sessionId, userId: req.userId });
    if (!session) {
      return res.status(403).json({ message: "Access denied or session not found." });
    }

    // Check message count limits for current user
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User profile not found." });
    }

    if (user.messageCount >= user.messageLimit) {
      return res.status(403).json({ 
        message: "Usage limit reached! Please buy more credits using M-Pesa to continue using Scholar Assistant.",
        limitReached: true,
        messageCount: user.messageCount,
        messageLimit: user.messageLimit
      });
    }

    // 1. Save user message
    const userMessage = new ChatMessage({
      sessionId: req.params.sessionId,
      sender: "user",
      text,
      attachment,
    });
    await userMessage.save();

    // Increment user message count
    user.messageCount += 1;
    await user.save();

    // 2. Generate upgraded mock AI response text
    let aiText = "";
    const query = text.toLowerCase().trim();

    if (query.includes("summarize") || query.includes("summary")) {
      // Summary Mode
      const topic = text.replace(/summarize|summary|of|about/ig, "").trim();
      const displayTopic = topic ? `"${topic}"` : "your provided context";
      aiText = `### 📝 Study Summary: ${displayTopic || "Overview"}

Here is a high-level summary matching the main highlights of this subject:

* **Core Theme**: Focused analysis on foundational concepts, structural dependencies, and execution workflows.
* **Key Arguments**:
  1. Systematic approach simplifies complex learning patterns.
  2. Incremental verification guarantees stable outputs.
  3. Integration of smart tools bridges user requirements with live engines.
* **Critical Takeaway**: Structuring topic scopes into compact modular points significantly boosts retention and study efficiency.

*Let me know if you would like to expand on any specific section!*`;
    } 
    else if (query.includes("note") || query.includes("notes")) {
      // Short Notes Mode
      const topic = text.replace(/notes|note|on|about/ig, "").trim();
      const displayTopic = topic ? `"${topic}"` : "this academic subject";
      aiText = `### 📚 Revision Cheat-Sheet: ${displayTopic}

Below are quick short notes designed for exam review and prompt retention:

1. **Mitosis Phases (PMAT)**:
   - **Prophase**: Chromatin condenses, spindle fibers form.
   - **Metaphase**: Chromosomes line up along the equator.
   - **Anaphase**: Sister chromatids are separated to opposite poles.
   - **Telophase**: Nuclear membranes reform, cytokinesis initiates.
2. **Permissive Licenses**:
   - **MIT**: Highly permissive; requires copyright notice. No warranty.
   - **BSD**: Similar to MIT, but 3-clause adds restriction on using contributors' names for endorsements without permission.
3. **Core Formula References**:
   - $\\sum_{i=1}^n X_i$ represents cumulative dataset values.
   - $GDP = C + I + G + (X - M)$ (Macroeconomic market output).

*Keep these notes bookmarked in your revision dashboard!*`;
    } 
    else if (query.includes("pdf") || query.includes("read") || attachment) {
      // PDF/Document extraction Mode
      const docName = attachment || "uploaded_scholarly_document.pdf";
      aiText = `### 📄 PDF Document Analysis: \`${docName}\`

I have successfully parsed the document structure. Here is the metadata and analysis summary:

* **Document Name**: \`${docName}\`
* **Size**: 2.4 MB • **Pages Analyzed**: 12 pages
* **Extracted Highlights**:
  - Contains class notes detailing algorithmic structures and time complexities ($O(n \\log n)$ vs $O(n^2)$).
  - Outlines the differences in licensing (GNU GPL copyleft vs permissive BSD).
  - Recommends mock revision guidelines for upcoming final exams.
* **Recommended Next Step**: Ask me to *"create short notes"* on the algorithms discussed in page 4 of the PDF.`;
    } 
    else {
      // General Q&A Mode
      const keyword = text.split(" ").slice(-2).join(" ").replace(/[?.!]/g, "");
      aiText = `### 💡 Academic Response on "${text.length > 30 ? text.substring(0, 30) + "..." : text}"

I have analyzed your question regarding ${keyword ? `*${keyword}*` : "this subject"} and fetched references from the official library archives:

* **Explanation**: The subject involves foundational principles where variables, structural configurations, and workflows are highly correlated. Proper application of these techniques ensures optimized outputs.
* **Academic Context**: Standard reference texts describe this as a key prerequisite for upper-level academic tracks.
* **Reference**: *University Academic Library Archives, Section 4.A (2024)*.

How else can I help clarify this topic? I can provide a **summary**, generate **short notes**, or read related **PDFs**!`;
    }

    // 3. Save AI message
    const aiMessage = new ChatMessage({
      sessionId: req.params.sessionId,
      sender: "ai",
      text: aiText,
    });
    await aiMessage.save();

    res.status(201).json({
      userMessage,
      aiMessage,
      messageCount: user.messageCount,
      messageLimit: user.messageLimit
    });
  } catch (error) {
    console.error("Send Message Error:", error);
    res.status(500).json({ message: "Server error sending message." });
  }
});

module.exports = router;
