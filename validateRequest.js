/**
 * middleware/validateRequest.js
 * Validates the body of POST /split-bill before it reaches the controller.
 */

module.exports = function validateRequest(req, res, next) {
  const { text, participants, prices } = req.body;
  const errors = [];

  // ── text ──────────────────────────────────────────────────────────────────
  if (!text || typeof text !== "string" || text.trim().length === 0) {
    errors.push('"text" is required and must be a non-empty string.');
  }

  // ── participants ──────────────────────────────────────────────────────────
  if (!Array.isArray(participants) || participants.length < 2) {
    errors.push('"participants" must be an array with at least 2 names.');
  } else {
    const seen = new Set();
    participants.forEach((p, i) => {
      if (typeof p !== "string" || p.trim() === "") {
        errors.push(`participants[${i}] must be a non-empty string.`);
      }
      if (seen.has(p.toLowerCase())) {
        errors.push(`Duplicate participant name: "${p}".`);
      }
      seen.add(p.toLowerCase());
    });
  }

  // ── prices ────────────────────────────────────────────────────────────────
  if (!prices || typeof prices !== "object" || Array.isArray(prices)) {
    errors.push('"prices" must be an object mapping item names to numeric prices.');
  } else {
    if (Object.keys(prices).length === 0) {
      errors.push('"prices" must contain at least one item.');
    }
    for (const [key, val] of Object.entries(prices)) {
      const num = Number(val);
      if (isNaN(num) || num < 0) {
        errors.push(`Price for "${key}" must be a non-negative number (got "${val}").`);
      }
    }
  }

  if (errors.length > 0) {
    console.warn("⚠️  Validation failed:", errors);
    return res.status(400).json({
      success: false,
      error: "Validation failed",
      details: errors,
    });
  }

  next();
};
