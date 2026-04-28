/**
 * middleware/errorHandler.js
 * Centralised error handling — catches anything thrown from controllers/services.
 */

module.exports = function errorHandler(err, _req, res, _next) {
  console.error("\n🔴 Unhandled error:", err.message);
  if (process.env.NODE_ENV !== "production") {
    console.error(err.stack);
  }

  // Axios / network errors
  if (err.code === "ECONNABORTED") {
    return res.status(504).json({
      success: false,
      error: "AI API request timed out. Please try again.",
    });
  }

  if (err.response) {
    // Gemini returned a 4xx/5xx
    return res.status(502).json({
      success: false,
      error: "AI API returned an error.",
      detail: err.response.data?.error?.message || err.message,
    });
  }

  // JSON parse failures from AI
  if (err instanceof SyntaxError) {
    return res.status(422).json({
      success: false,
      error: "AI returned malformed JSON. Please try again.",
    });
  }

  // Missing API key
  if (err.message?.includes("AI_API_KEY")) {
    return res.status(500).json({
      success: false,
      error: "Server misconfiguration: AI API key is not set.",
    });
  }

  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message || "AI service is temporarily unavailable.",
    });
  }

  // Default 500
  return res.status(500).json({
    success: false,
    error: err.message || "Internal server error.",
  });
};
