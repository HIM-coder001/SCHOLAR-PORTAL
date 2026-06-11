const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");

// POST /api/payment/mpesa-push (simulates STK Push payment and credits the user)
router.post("/mpesa-push", authMiddleware, async (req, res) => {
  try {
    const { phone, amount } = req.body;

    if (!phone || !amount) {
      return res.status(400).json({ message: "Phone number and payment amount are required." });
    }

    // Basic Kenyan phone format validation
    const cleanPhone = phone.trim();
    if (!/^(?:254|\+254|0)?(7|1)\d{8}$/.test(cleanPhone)) {
      return res.status(400).json({ message: "Invalid M-Pesa phone number format. Use 07xx... or 254xx..." });
    }

    const parsedAmount = parseInt(amount, 10);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ message: "Invalid payment amount." });
    }

    // Find User
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User profile not found." });
    }

    // Simulate STK Push Latency (2 seconds delay before confirming)
    console.log(`[M-PESA] Initiating STK Push to ${cleanPhone} for KES ${parsedAmount}...`);
    await new Promise((resolve) => setTimeout(resolve, 2500));

    // Calculate credit value (KES 1 = 5 messages)
    const extraCredits = parsedAmount * 5;
    user.messageLimit += extraCredits;

    // Reset current messageCount if it has breached the old limit to ensure immediate unlock
    if (user.messageCount >= user.messageLimit - extraCredits) {
      // Offset usage so they get the full new capacity
      user.messageCount = Math.max(0, user.messageCount - extraCredits);
    }

    await user.save();
    console.log(`[M-PESA] STK push confirmed. Credited ${extraCredits} messages to user ${user.email}`);

    res.json({
      message: `M-Pesa payment of KES ${parsedAmount} processed successfully. Received transaction ID: MP${Math.random().toString(36).substr(2, 9).toUpperCase()}.`,
      messageCount: user.messageCount,
      messageLimit: user.messageLimit,
    });
  } catch (error) {
    console.error("M-Pesa Simulation Error:", error);
    res.status(500).json({ message: "M-Pesa payment processor simulation failed." });
  }
});

module.exports = router;
