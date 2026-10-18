
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const reviewRoutes = require("./src/routes/reviewRoutes");

const app = express();

app.disable("x-powered-by");

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  })
);

app.use(express.json({ limit: "100kb" }));

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "AI Code Review API is running",
    aiConfigured: Boolean(
      process.env.GEMINI_API_KEY && process.env.GEMINI_MODEL
    ),
  });
});

app.use("/api/reviews", reviewRoutes);

// Return a safe error for malformed JSON requests.
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON request body.",
    });
  }

  console.error("Server error:", error.message);

  return res.status(500).json({
    success: false,
    message: "An unexpected server error occurred.",
  });
});

const PORT = process.env.PORT || 5000;

if (!process.env.GEMINI_API_KEY || !process.env.GEMINI_MODEL) {
  console.warn("Gemini API configuration is missing.");
}

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
