/**
 * server.js - Entry point for SplitAI.
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const billRoutes = require("./billRoutes");
const errorHandler = require("./errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "30mb" }));

app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.use("/", billRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", version: "1.0.0", timestamp: new Date().toISOString() });
});

async function attachFrontend() {
  if (process.env.NODE_ENV === "production") {
    const distDir = path.join(__dirname, "dist");
    app.use(express.static(distDir));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distDir, "index.html"));
    });
    return;
  }

  const { createServer } = await import("vite");
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
}

async function start() {
  await attachFrontend();

  app.use((_req, res) => {
    res.status(404).json({ success: false, error: "Route not found" });
  });

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`\nSplitAI app running on http://localhost:${PORT}`);
    console.log("POST /split-bill - Process a bill");
    console.log("POST /split-bill/validate - Validate input only");
    console.log("POST /scan-receipt - Scan receipt image");
    console.log("GET  /health - Health check\n");
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

module.exports = app;
