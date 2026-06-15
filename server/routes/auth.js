const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");
const rateLimiter = require("../middleware/rateLimiter");

// Limit authentication requests to 20 attempts per 15 minutes
const authLimiter = rateLimiter(20, 15 * 60 * 1000);

// Register Endpoint
router.post("/register", authLimiter, async (req, res) => {
  try {
    const { fullName, email, password, institution, course } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "A user with this email address already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      fullName,
      email,
      password: hashedPassword,
      institution,
      course,
    });

    await user.save();

    // Create JWT Token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        institution: user.institution,
        course: user.course,
      }
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error during registration." });
  }
});

// Login Endpoint
router.post("/login", authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verify User
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Verify Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Create JWT Token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        institution: user.institution,
        course: user.course,
      }
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error during login." });
  }
});

// Get Current User Profile
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json(user);
  } catch (error) {
    console.error("Profile Fetch Error:", error);
    res.status(500).json({ message: "Server error fetching user profile." });
  }
});

// Google OAuth Redirect
router.get("/google", (req, res) => {
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || "http://localhost:5000/api/auth/google/callback";

  if (!googleClientId) {
    console.log("GOOGLE_CLIENT_ID not configured. Redirecting to Mock Google OAuth flow.");
    return res.redirect(`${redirectUri}?code=mock_google_code_123`);
  }

  const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${googleClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=openid%20profile%20email`;
  res.redirect(oauthUrl);
});

// Google OAuth Callback
router.get("/google/callback", async (req, res) => {
  const { code } = req.query;
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || "http://localhost:5000/api/auth/google/callback";
  const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";

  try {
    let email, fullName;

    if (!googleClientId || !googleClientSecret || code === "mock_google_code_123") {
      email = "scholar.google@university.edu";
      fullName = "Google Scholar";
    } else {
      const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code,
          client_id: googleClientId,
          client_secret: googleClientSecret,
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
        }),
      });

      if (!tokenRes.ok) {
        throw new Error("Failed to exchange authorization code for Google token.");
      }

      const tokenData = await tokenRes.json();
      const accessToken = tokenData.access_token;

      const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!userRes.ok) {
        throw new Error("Failed to fetch Google user profile.");
      }

      const userData = await userRes.json();
      email = userData.email;
      fullName = userData.name || userData.given_name || "Google User";
    }

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      const crypto = require("crypto");
      const randomPassword = crypto.randomBytes(16).toString("hex");
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      user = new User({
        fullName,
        email,
        password: hashedPassword,
        institution: "Stanford University",
        course: "Computer Science",
      });
      await user.save();
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    const userData = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      institution: user.institution,
      course: user.course,
    };

    res.redirect(`${clientOrigin}/login?token=${token}&user=${encodeURIComponent(JSON.stringify(userData))}`);
  } catch (error) {
    console.error("Google OAuth Callback Error:", error);
    res.redirect(`${clientOrigin}/login?error=${encodeURIComponent("Google authentication failed.")}`);
  }
});

// GitHub OAuth Redirect
router.get("/github", (req, res) => {
  const githubClientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = process.env.GITHUB_REDIRECT_URI || "http://localhost:5000/api/auth/github/callback";

  if (!githubClientId) {
    console.log("GITHUB_CLIENT_ID not configured. Redirecting to Mock GitHub OAuth flow.");
    return res.redirect(`${redirectUri}?code=mock_github_code_123`);
  }

  const oauthUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user:email`;
  res.redirect(oauthUrl);
});

// GitHub OAuth Callback
router.get("/github/callback", async (req, res) => {
  const { code } = req.query;
  const githubClientId = process.env.GITHUB_CLIENT_ID;
  const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
  const redirectUri = process.env.GITHUB_REDIRECT_URI || "http://localhost:5000/api/auth/github/callback";
  const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";

  try {
    let email, fullName;

    if (!githubClientId || !githubClientSecret || code === "mock_github_code_123") {
      email = "scholar.github@university.edu";
      fullName = "GitHub Scholar";
    } else {
      const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          client_id: githubClientId,
          client_secret: githubClientSecret,
          code,
          redirect_uri: redirectUri,
        }),
      });

      if (!tokenRes.ok) {
        throw new Error("Failed to exchange authorization code for GitHub token.");
      }

      const tokenData = await tokenRes.json();
      const accessToken = tokenData.access_token;

      if (!accessToken) {
        throw new Error(tokenData.error_description || "Access token not received from GitHub.");
      }

      const userRes = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "User-Agent": "ScholarHub-OAuth-App",
        },
      });

      if (!userRes.ok) {
        throw new Error("Failed to fetch GitHub user profile.");
      }

      const githubUser = await userRes.json();
      fullName = githubUser.name || githubUser.login || "GitHub User";

      const emailRes = await fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "User-Agent": "ScholarHub-OAuth-App",
        },
      });

      if (emailRes.ok) {
        const emails = await emailRes.json();
        const primaryEmail = emails.find(e => e.primary && e.verified) || emails[0];
        email = primaryEmail ? primaryEmail.email : null;
      }

      if (!email) {
        email = githubUser.email || `${githubUser.login}@github.com`;
      }
    }

    let user = await User.findOne({ email });
    if (!user) {
      const crypto = require("crypto");
      const randomPassword = crypto.randomBytes(16).toString("hex");
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      user = new User({
        fullName,
        email,
        password: hashedPassword,
        institution: "Stanford University",
        course: "Computer Science",
      });
      await user.save();
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    const userData = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      institution: user.institution,
      course: user.course,
    };

    res.redirect(`${clientOrigin}/login?token=${token}&user=${encodeURIComponent(JSON.stringify(userData))}`);
  } catch (error) {
    console.error("GitHub OAuth Callback Error:", error);
    res.redirect(`${clientOrigin}/login?error=${encodeURIComponent("GitHub authentication failed.")}`);
  }
});

module.exports = router;
