// server.js — Main Express server
const path = require("node:path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express     = require("express");
const cors        = require("cors");
const helmet      = require("helmet");
const morgan      = require("morgan");
const rateLimit   = require("express-rate-limit");

const { clerkMiddleware, requireAuth } = require("@clerk/express");
const detectRouter  = require("./routes/detect");
const historyRouter = require("./routes/history");
const factcheckRouter = require("./routes/factcheck");

const app  = express();
const PORT = process.env.PORT || 4000;

// Helper to check if a key is a placeholder
const isPlaceholder = (k) => !k || k.includes("_your_");

const clerkKeyMissing = isPlaceholder(process.env.CLERK_PUBLISHABLE_KEY) || isPlaceholder(process.env.CLERK_SECRET_KEY);
const localClerkAuthEnabled = String(process.env.LOCAL_CLERK_AUTH || "0") === "1";
const isProduction = process.env.NODE_ENV === "production";
const shouldEnforceClerkAuth = !clerkKeyMissing && (isProduction || localClerkAuthEnabled);

// ─── Security & Middleware ────────────────────────────────────────────────────

app.use(helmet());
app.use(morgan("dev"));
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

if (shouldEnforceClerkAuth) {
  app.use(clerkMiddleware());
} else {
  console.warn("⚠️ Clerk auth disabled for local/dev mode. Set LOCAL_CLERK_AUTH=1 to enforce auth locally.");
}

// Rate limiting — 30 requests per minute per IP (after Clerk so user id can be used if needed later)
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please wait a moment." },
});

app.use("/api", (req, res, next) => {
  console.log(`[API REQUEST] ${req.method} ${req.path}`);
  next();
});

// ─── Routes ──────────────────────────────────────────────────────────────────

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

const maybeAuth = shouldEnforceClerkAuth ? requireAuth() : (req, res, next) => next();

app.use("/api/detect", limiter, maybeAuth, detectRouter);
app.use("/api/history", maybeAuth, historyRouter);
app.use("/api/factcheck", maybeAuth, factcheckRouter);

// 404
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

// ─── Start ───────────────────────────────────────────────────────────────────

if (!process.env.VERCEL) {
  const startServer = (port) => {
    const server = app.listen(port, () => {
      console.log(`\n🚀 AI Detector API running on http://localhost:${port}`);
      console.log(`   Health: http://localhost:${port}/api/health`);
      console.log(`   Detect: POST http://localhost:${port}/api/detect/text\n`);
    });

    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        const nextPort = Number(port) + 1;
        console.warn(`⚠️ Port ${port} is in use. Retrying on ${nextPort}...`);
        startServer(nextPort);
        return;
      }

      throw err;
    });
  };

  startServer(PORT);
}

module.exports = app;
