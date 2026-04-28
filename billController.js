/**
 * controllers/billController.js
 * Orchestrates AI call → split calculation → response
 */

const aiService = require("./aiService");
const { calculateSplit } = require("./calculateSplit");

/**
 * POST /split-bill
 * Body: { text, participants, prices }
 */
exports.splitBill = async (req, res, next) => {
  try {
    const { text, participants, prices } = req.body;

    console.log("\n📥 New bill request");
    console.log("   Text:", text);
    console.log("   Participants:", participants);
    console.log("   Prices:", prices);

    // ── 1. Ask AI to parse the natural-language description ──────────────────
    console.log("\n🤖 Sending to Gemini AI...");
    const aiResult = await aiService.parseBillText({ text, participants, prices });
    console.log("✅ AI parsed items:", JSON.stringify(aiResult.items, null, 2));

    // ── 2. Merge AI item-sharing data with the provided prices ────────────────
    const enrichedItems = aiResult.items.map((item) => {
      // Try to match the AI item name to a key in prices (case-insensitive)
      const priceKey = Object.keys(prices).find(
        (k) => k.toLowerCase() === item.name.toLowerCase()
      );
      const price = priceKey ? prices[priceKey] : 0;

      if (price === 0) {
        console.warn(`⚠️  No price found for item "${item.name}" — defaulting to 0`);
      }

      return { ...item, price };
    });

    // ── 3. Calculate who owes whom ────────────────────────────────────────────
    console.log("\n💰 Calculating splits...");
    const result = calculateSplit(participants, enrichedItems);
    console.log("✅ Split result:", JSON.stringify(result, null, 2));

    // ── 4. Return final response ──────────────────────────────────────────────
    return res.status(200).json({
      success: true,
      input: { text, participants, prices },
      ai_parsed_items: aiResult.items,
      enriched_items: enrichedItems,
      ...result,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /split-bill/validate
 * Returns 200 if input is valid, no AI call made
 */
exports.validateOnly = (_req, res) => {
  return res.status(200).json({
    success: true,
    message: "Input is valid. Call POST /split-bill to process.",
  });
};

/**
 * POST /scan-receipt
 * Body: { imageBase64, mimeType }
 */
exports.scanReceipt = async (req, res, next) => {
  try {
    const rawImage = req.body.imageBase64 || req.body.base64 || "";
    const mimeType = req.body.mimeType || req.body.mediaType || "image/jpeg";
    const imageBase64 = String(rawImage).replace(/^data:[^;]+;base64,/, "");

    if (!imageBase64) {
      return res.status(400).json({
        success: false,
        error: '"imageBase64" is required.',
      });
    }

    const receipt = await aiService.parseReceiptImage({ imageBase64, mimeType });

    return res.status(200).json({
      success: true,
      ...receipt,
    });
  } catch (err) {
    next(err);
  }
};
