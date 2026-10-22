// Vercel Node function entrypoint.
// Lazily load the Express app so startup exceptions are logged with a useful trace.
let app;

module.exports = function handler(req, res) {
  try {
    if (!app) app = require("../backend/server");
  } catch (err) {
    console.error("[API STARTUP ERROR]", err && err.stack ? err.stack : err);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(JSON.stringify({
        error: "DetectAI API failed to start. Check Vercel Function Logs for [API STARTUP ERROR]."
      }));
    }
    return;
  }

  try {
    return app(req, res);
  } catch (err) {
    console.error("[API REQUEST ERROR]", err && err.stack ? err.stack : err);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(JSON.stringify({
        error: "DetectAI API encountered an internal error. Check Vercel Function Logs."
      }));
    }
  }
};
