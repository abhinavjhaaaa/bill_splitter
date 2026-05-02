/**
 * aiService.js
 * Handles all communication with the OpenAI Responses API.
 */

const axios = require("axios");

const MAX_RETRIES = parseInt(process.env.AI_MAX_RETRIES, 10) || 3;
const DEFAULT_MODELS = [
  "gpt-5.4-mini",
  "gpt-5.4-nano",
];

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function getModelCandidates() {
  return unique([process.env.OPENAI_MODEL, ...DEFAULT_MODELS]);
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

function extractOpenAIText(data) {
  if (typeof data?.output_text === "string" && data.output_text.trim()) {
    return data.output_text.trim();
  }

  const rawText = (data?.output || [])
    .flatMap((item) => item.content || [])
    .map((content) => content.text || content.output_text || "")
    .join("")
    .trim();

  if (!rawText) {
    throw new Error("OpenAI returned an empty response.");
  }

  return rawText;
}

function billItemsSchema() {
  return {
    type: "json_schema",
    name: "bill_items",
    strict: true,
    schema: {
      type: "object",
      additionalProperties: false,
      required: ["items"],
      properties: {
        items: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            required: ["name", "shared_by"],
            properties: {
              name: { type: "string" },
              shared_by: {
                type: "array",
                items: { type: "string" },
              },
            },
          },
        },
      },
    },
  };
}

function receiptSchema() {
  return {
    type: "json_schema",
    name: "receipt_items",
    strict: true,
    schema: {
      type: "object",
      additionalProperties: false,
      required: ["restaurant", "items", "subtotal", "tax", "total"],
      properties: {
        restaurant: { type: "string" },
        items: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            required: ["name", "price"],
            properties: {
              name: { type: "string" },
              price: { type: "number" },
            },
          },
        },
        subtotal: { type: "number" },
        tax: { type: "number" },
        total: { type: "number" },
      },
    },
  };
}

async function callOpenAI(input, responseFormat, maxOutputTokens = 1024, model = getModelCandidates()[0]) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set in environment variables.");
  }

  const response = await axios.post(
    "https://api.openai.com/v1/responses",
    {
      model,
      input,
      max_output_tokens: maxOutputTokens,
      store: false,
      text: {
        format: responseFormat,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      timeout: 45000,
    }
  );

  return JSON.parse(cleanJsonText(extractOpenAIText(response.data)));
}

function logOpenAIError(label, model, attempt, err) {
  if (err.response?.data) {
    console.error(
      `${label} error (${model}, attempt ${attempt}):`,
      JSON.stringify(err.response.data, null, 2)
    );
  } else {
    console.error(`${label} failed (${model}, attempt ${attempt}):`, err.message);
  }
}

function isNonRetryableOpenAIError(err) {
  const status = err.response?.status;
  return status && [400, 401, 402, 403, 404].includes(status);
}

function buildOpenAIRequestError(err) {
  const status = err.response?.status;
  const detail = err.response?.data?.error?.message || err.message;
  const wrapped = new Error(`OpenAI API error: ${detail}`);
  wrapped.statusCode = status === 429 ? 429 : status && status < 500 ? 502 : 503;
  return wrapped;
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
        const parsed = await callOpenAI(
          [
            {
              role: "user",
              content: [{ type: "input_text", text: buildPrompt(input) }],
            },
          ],
          billItemsSchema(),
          1024,
          model
        );

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
        if (err.message?.includes("OPENAI_API_KEY")) {
          throw err;
        }
        logOpenAIError("OpenAI API", model, attempt, err);
        if (isNonRetryableOpenAIError(err)) {
          throw buildOpenAIRequestError(err);
        }
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
        const parsed = await callOpenAI(
          [
            {
              role: "user",
              content: [
                { type: "input_text", text: prompt },
                {
                  type: "input_image",
                  image_url: `data:${mimeType || "image/jpeg"};base64,${imageBase64}`,
                },
              ],
            },
          ],
          receiptSchema(),
          1536,
          model
        );

        return normalizeReceipt(parsed);
      } catch (err) {
        lastError = err;
        if (err.message?.includes("OPENAI_API_KEY")) {
          throw err;
        }
        logOpenAIError("OpenAI receipt scan", model, attempt, err);
        if (isNonRetryableOpenAIError(err)) {
          throw buildOpenAIRequestError(err);
        }
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
