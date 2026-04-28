/**
 * aiService.js
 * Handles all communication with the Google Gemini API.
 */

const axios = require("axios");

const MAX_RETRIES = parseInt(process.env.AI_MAX_RETRIES, 10) || 3;
const DEFAULT_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-flash-lite-latest",
];

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function getModelCandidates() {
  return unique([process.env.AI_MODEL, ...DEFAULT_MODELS]);
}

function buildPrompt({ text, participants, prices }) {
  const itemList = Object.entries(prices)
    .map(([name, price]) => `  - ${name}: ${price}`)
    .join("\n");

  const participantList = participants.join(", ");

  return `You are a bill-splitting assistant. Parse the following bill description and determine which participants share each item.

BILL DESCRIPTION:
"${text}"

PARTICIPANTS: ${participantList}

ITEMS AND PRICES:
${itemList}

RULES:
1. Use ONLY the participant names from the list above (exact spelling, case-sensitive).
2. Every item in the ITEMS list MUST appear in the output.
3. "shared_by" must be a non-empty array containing only names from PARTICIPANTS.
4. If an item is not mentioned specifically, assume ALL participants share it.
5. Respond with ONLY a raw JSON object. No markdown, no backticks, no explanation.

REQUIRED OUTPUT FORMAT:
{
  "items": [
    { "name": "ItemName", "shared_by": ["Participant1", "Participant2"] }
  ]
}`;
}

function cleanJsonText(rawText) {
  const cleaned = String(rawText || "")
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return cleaned.slice(firstBrace, lastBrace + 1);
  }

  return cleaned;
}

function extractGeminiText(data) {
  const candidate = data?.candidates?.[0];
  if (!candidate) {
    throw new Error("Gemini returned no candidates.");
  }

  const rawText = candidate.content?.parts
    ?.map((part) => part.text || "")
    .join("")
    .trim();

  if (!rawText) {
    throw new Error("Gemini returned an empty response.");
  }

  return rawText;
}

async function callGemini(parts, maxOutputTokens = 1024, model = getModelCandidates()[0]) {
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) {
    throw new Error("AI_API_KEY is not set in environment variables.");
  }

  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      contents: [{ parts }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens,
        responseMimeType: "application/json",
      },
    },
    {
      headers: { "Content-Type": "application/json" },
      timeout: 30000,
    }
  );

  return JSON.parse(cleanJsonText(extractGeminiText(response.data)));
}

function logGeminiError(label, model, attempt, err) {
  if (err.response?.data) {
    console.error(
      `${label} error (${model}, attempt ${attempt}):`,
      JSON.stringify(err.response.data, null, 2)
    );
  } else {
    console.error(`${label} failed (${model}, attempt ${attempt}):`, err.message);
  }
}

function buildAiFailure(message, lastError) {
  const err = new Error(`${message} Last error: ${lastError?.message}`);
  err.statusCode = lastError?.response?.status === 429 ? 429 : 503;
  return err;
}

async function parseBillText(input) {
  let lastError = null;
  const models = getModelCandidates();

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    for (const model of models) {
      try {
        const parsed = await callGemini([{ text: buildPrompt(input) }], 1024, model);

        if (!Array.isArray(parsed?.items)) {
          throw new Error('Parsed JSON is missing the "items" array.');
        }

        for (const item of parsed.items) {
          if (typeof item.name !== "string" || !Array.isArray(item.shared_by)) {
            throw new Error(`Invalid item returned by AI: ${JSON.stringify(item)}`);
          }
        }

        return parsed;
      } catch (err) {
        lastError = err;
        logGeminiError("Gemini API", model, attempt, err);
      }
    }

    if (attempt < MAX_RETRIES) {
      await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
    }
  }

  throw buildAiFailure(
    `AI failed to return valid JSON after ${MAX_RETRIES} attempts.`,
    lastError
  );
}

function toNumber(value) {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  const cleaned = String(value || "").replace(/[^\d.-]/g, "");
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeReceipt(parsed) {
  const items = Array.isArray(parsed?.items)
    ? parsed.items
        .map((item) => ({
          name: String(item.name || "").trim(),
          price: toNumber(item.price),
        }))
        .filter((item) => item.name && item.price > 0)
    : [];

  if (items.length === 0) {
    throw new Error("AI could not find any receipt items.");
  }

  const subtotal = toNumber(parsed.subtotal);
  const tax = toNumber(parsed.tax);
  const itemTotal = items.reduce((sum, item) => sum + item.price, 0);
  const total = toNumber(parsed.total) || subtotal + tax || itemTotal;

  return {
    restaurant: String(parsed.restaurant || parsed.merchant || "Scanned Bill").trim(),
    items,
    subtotal,
    tax,
    total: Math.round(total * 100) / 100,
  };
}

async function parseReceiptImage({ imageBase64, mimeType }) {
  const prompt = `Extract all line items from this receipt or bill.

Return ONLY valid JSON in this exact shape:
{
  "restaurant": "Name or Unknown",
  "items": [{ "name": "Item name", "price": 12.50 }],
  "subtotal": 100.00,
  "tax": 10.00,
  "total": 110.00
}

Rules:
1. Prices must be plain numbers.
2. Keep item names short and readable.
3. Ignore payment method, card number, address, phone number, and receipt metadata.
4. If subtotal, tax, or total is unclear, use 0 for that field.`;

  let lastError = null;
  const models = getModelCandidates();

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    for (const model of models) {
      try {
        const parsed = await callGemini(
          [
            {
              inline_data: {
                mime_type: mimeType || "image/jpeg",
                data: imageBase64,
              },
            },
            { text: prompt },
          ],
          1536,
          model
        );

        return normalizeReceipt(parsed);
      } catch (err) {
        lastError = err;
        logGeminiError("Gemini receipt scan", model, attempt, err);
      }
    }

    if (attempt < MAX_RETRIES) {
      await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
    }
  }

  throw buildAiFailure(
    `AI failed to scan the receipt after ${MAX_RETRIES} attempts.`,
    lastError
  );
}

module.exports = { parseBillText, parseReceiptImage };
