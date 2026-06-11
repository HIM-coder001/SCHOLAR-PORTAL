require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Paper = require("./models/Paper");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes Imports
const authRoutes = require("./routes/auth");
const paperRoutes = require("./routes/papers");
const chatRoutes = require("./routes/chats");
const noteRoutes = require("./routes/notes");
const paymentRoutes = require("./routes/payment");

// Routes Registration
app.use("/api/auth", authRoutes);
app.use("/api/papers", paperRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/payment", paymentRoutes);

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", database: mongoose.connection.readyState === 1 ? "connected" : "disconnected" });
});

// Port configuration
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI

// Seed Function
const seedDatabase = async () => {
  try {
    const count = await Paper.countDocuments();
    if (count > 0) {
      console.log("Database already seeded with papers.");
      return;
    }

    const defaultPapers = [
      {
        title: "Data Structures & Algorithms",
        module: "CS-202",
        instructor: "Dr. Sarah Jenkins",
        semester: "2023 Fall",
        icon: ">_",
        iconBg: "bg-emerald-50",
        color: "text-emerald-800 font-mono text-sm",
        downloads: 140,
        views: 450,
        isFeatured: false,
        badges: ["Library Portal"],
      },
      {
        title: "Advanced Engineering Mathematics",
        module: "MA-305",
        instructor: "Prof. David Thorne",
        semester: "2022 Spring",
        icon: "Σ",
        iconBg: "bg-rose-50",
        color: "text-rose-600 font-bold",
        downloads: 98,
        views: 320,
        isFeatured: false,
        badges: ["Library Portal"],
      },
      {
        title: "Molecular Biology Fundamentals",
        module: "BIO-112",
        instructor: "Dr. Marcus Aurelius",
        semester: "2023 Fall",
        icon: "⚗",
        iconBg: "bg-slate-100",
        color: "text-slate-500 font-bold",
        downloads: 120,
        views: 390,
        isFeatured: false,
        badges: ["Library Portal"],
      },
      {
        title: "Macroeconomics: Global Markets Analysis",
        module: "ECO-301",
        instructor: "Prof. Alan Greenspan",
        semester: "2024 Predicted",
        icon: "📈",
        iconBg: "bg-emerald-50",
        color: "text-emerald-850 font-bold",
        downloads: 2400,
        views: 8900,
        isFeatured: true,
        badges: ["Trending Resource", "2024 Predicted"],
        description: "This resource includes a mock paper set by the faculty for the upcoming finals based on current economic trends. Recommended for third-year honors students.",
        imageUrl: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=400&auto=format&fit=crop&q=80",
      },
      {
        title: "Digital Design Principles",
        module: "DD-201",
        instructor: "Prof. Elena Rossi",
        semester: "2023 Summer",
        icon: "📐",
        iconBg: "bg-emerald-50",
        color: "text-[#004d40] font-black",
        downloads: 85,
        views: 290,
        isFeatured: false,
        badges: ["Library Portal"],
      },
    ];

    await Paper.insertMany(defaultPapers);
    console.log("Database seeded successfully with mockup past papers.");
  } catch (error) {
    console.error("Database seeding failed:", error);
  }
};

// Database Connection and Express Server startup
mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log("Connected to MongoDB successfully at");
    await seedDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failure:", err);
    // Graceful exit fallback so user knows mongo isn't running
    console.log("Starting Express server anyway (mock auth services only)...");
    app.listen(PORT, () => {
      console.log(`Server running in fallback mode on port ${PORT}`);
    });
  });
