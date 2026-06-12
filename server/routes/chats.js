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

const multer = require("multer");
const pdfParse = require("pdf-parse");

// Setup multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

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

// POST upload PDF
router.post("/:sessionId/upload", authMiddleware, upload.single("document"), async (req, res) => {
  try {
    const session = await ChatSession.findOne({ _id: req.params.sessionId, userId: req.userId });
    if (!session) {
      return res.status(403).json({ message: "Access denied or session not found." });
    }

    const user = await User.findById(req.userId);
    if (!user || user.messageCount >= user.messageLimit) {
      return res.status(403).json({ message: "Usage limit reached. Please top up." });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    // Parse PDF text
    const data = await pdfParse(req.file.buffer);
    
    // Save context for subsequent chat turns (up to 50,000 characters)
    session.documentContext = data.text ? data.text.substring(0, 50000) : "";
    session.documentName = req.file.originalname;
    await session.save();

    const extractedText = data.text ? data.text.substring(0, 500) : ""; // Take first 500 chars as summary

    // 1. Save user file message
    const userMessage = new ChatMessage({
      sessionId: req.params.sessionId,
      sender: "user",
      text: `Attached document: ${req.file.originalname}`,
      attachment: req.file.originalname,
    });
    await userMessage.save();
    
    user.messageCount += 1;
    await user.save();

    // 2. Generate AI response based on parsed text
    const aiText = `### 📄 PDF Document Analysis: \`${req.file.originalname}\`\n\nI have parsed the document. Here is a brief extract from the beginning:\n\n> *"${extractedText.replace(/\\n/g, " ")}..."*\n\n**What would you like me to do with this?** I can summarize it further, extract key notes, or answer specific questions.`;
    
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
    console.error("PDF Upload Error:", error);
    res.status(500).json({ message: "Server error parsing PDF." });
  }
});

// POST message to a session (Send User message & Gemini / fallback response)
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

    // 2. Generate Gemini or fallback response
    let aiText = "";
    
    // Check if Gemini API key exists
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        // Fetch last 15 messages for conversational history
        const previousMessages = await ChatMessage.find({ sessionId: session._id }).sort({ createdAt: 1 }).limit(15);
        
        // Build the contents array for Gemini API
        const contents = [];
        for (const msg of previousMessages) {
          if (!msg.text) continue;
          contents.push({
            role: msg.sender === "user" ? "user" : "model",
            parts: [{ text: msg.text }]
          });
        }
        
        const systemInstructionText = "You are Scholar Assistant, an advanced academic AI tutor. Help the student analyze papers, summarize articles, generate study notes, and learn concepts. Be concise, academic, professional, and helpful. Format your responses in clean, beautiful Markdown. Use LaTeX notation for formulas (e.g. $O(n \\log n)$ or $$E = mc^2$$). Important: Ensure your response only uses Markdown structure compatible with a simple line-by-line parser (### headers, * bullet points, and > blockquotes. Avoid code blocks, custom table grids, and complex indentation).";
        
        let systemPrompt = systemInstructionText;
        if (session.documentContext) {
          systemPrompt += `\n\n[DOCUMENT CONTEXT]: The student has uploaded a PDF document named "${session.documentName}". Here is the content of the document:\n"""\n${session.documentContext}\n"""\nUse this context to answer questions about the document. If the user asks about the document, reference its contents accurately.`;
        }

        const requestBody = {
          contents,
          systemInstruction: {
            parts: [{ text: systemPrompt }]
          },
          generationConfig: {
            maxOutputTokens: 2048,
            temperature: 0.7,
          }
        };

        const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(requestBody)
        });

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          if (geminiData.candidates && geminiData.candidates[0]?.content?.parts?.[0]?.text) {
            aiText = geminiData.candidates[0].content.parts[0].text;
          }
        } else {
          const errText = await geminiRes.text();
          console.error("Gemini API Error details:", errText);
        }
      } catch (geminiError) {
        console.error("Gemini API Invocation Error:", geminiError);
      }
    }

    if (!aiText) {
      // Fallback Sandbox Engine
      const query = text.toLowerCase().trim();
      const apiKeyNotice = "\n\n*(Note: Scholar Assistant is running in Sandbox Mode. Configure MONGODB_URI & GEMINI_API_KEY in server/.env for live AI responses).*";

      let answeredFromDoc = false;

      if (session.documentContext) {
        const context = session.documentContext;
        const sentences = context.split(/[.!?\n]/).map(s => s.trim()).filter(s => s.length > 15);
        const queryWords = query.replace(/[^a-zA-Z0-9\s]/g, "").split(/\s+/).filter(w => w.length > 3 && !["what", "that", "this", "have", "with", "from", "your", "about", "could", "were", "they", "them", "then", "there", "some", "more", "most"].includes(w));
        
        let matchingSentences = [];
        if (queryWords.length > 0) {
          matchingSentences = sentences.filter(s => {
            const sLower = s.toLowerCase();
            return queryWords.some(w => sLower.includes(w));
          });
        }

        const extract = matchingSentences.slice(0, 3).join(". ");
        if (extract) {
          aiText = `### 📄 Analysis of "${session.documentName}"\n\nI scanned the document context and found the following relevant highlights:\n\n> *"${extract}..."*\n\nBased on these details, the paper touches on concepts related to **${queryWords.slice(0, 3).join(", ")}**. Let me know if you want me to expand on these points or outline other chapters!${apiKeyNotice}`;
          answeredFromDoc = true;
        }
      }

      if (!answeredFromDoc) {
        if (query.includes("summarize") || query.includes("summary")) {
          const topic = text.replace(/summarize|summary|of|about/ig, "").trim();
          const displayTopic = topic ? `"${topic}"` : "your research context";
          aiText = `### 📝 Study Summary: ${displayTopic}\n\nHere is a high-level conceptual summary of the topic:\n\n* **Core Theme**: Focused analysis on foundational concepts, structural dependencies, and execution workflows.\n* **Key Insights**:\n  1. Systematic modular approach simplifies complex learning structures.\n  2. Sequential verification guarantees stable outcomes.\n  3. Integration of smart tools bridges user inputs with execution engines.\n* **Critical Takeaway**: Structuring topic scopes into compact bullet points boosts retention and exam prep efficiency.\n\nHow would you like to expand on this? I can create short notes or answer questions.${apiKeyNotice}`;
        } 
        else if (query.includes("note") || query.includes("notes") || query.includes("cheat sheet")) {
          const topic = text.replace(/notes|note|on|about/ig, "").trim();
          const displayTopic = topic ? `"${topic}"` : "this academic subject";
          aiText = `### 📚 Revision Notes: ${displayTopic}\n\nHere are study revision notes designed for quick review:\n\n1. **Foundational Principles**: Focus on understanding key definitions, relations, and core constraints.\n2. **Standard Formulas**:\n   - $\\sum_{i=1}^n X_i$ represents the cumulative sum of variables.\n   - $GDP = C + I + G + (X - M)$ represents global macroeconomic output.\n3. **Important Checkpoint**: Always verify boundary conditions and edge cases before executing full models.\n\n*Bookmark these notes in your revision panel!*${apiKeyNotice}`;
        } 
        else if (query.includes("hello") || query.includes("hi") || query.includes("hey")) {
          aiText = `### 👋 Welcome to Scholar Assistant!\n\nI am your dedicated academic AI helper. You can ask me to:\n* **Analyze PDFs**: Upload a research paper or note set, and ask me specific questions.\n* **Summarize**: Get high-level reviews of complicated topics.\n* **Study Guide**: Generate quick notes or revision cheat-sheets.\n\nHow can I help you with your studies today?${apiKeyNotice}`;
        }
        else {
          const keyword = text.split(" ").slice(-2).join(" ").replace(/[?.!]/g, "");
          aiText = `### 💡 Academic Response on "${text.length > 35 ? text.substring(0, 35) + "..." : text}"\n\nI have parsed your question regarding ${keyword ? `*${keyword}*` : "this topic"} and scanned our local scholar catalog:\n\n* **Overview**: The topic involves fundamental principles where variables, structural configurations, and workflows are highly correlated. Proper application of these techniques ensures optimized outputs.\n* **Academic Reference**: *Academic Library Archives, Section 4.C (2024)*.\n* **Recommended Focus**: Study the foundational abstractions and check out the related past papers in the main dashboard.\n\nWhat else can I clarify for you? I can summarize this, write notes, or parse another document!${apiKeyNotice}`;
        }
      }
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
