# SplitAI Backend

AI-powered bill splitter app using the **OpenAI Responses API** + **Node.js / Express**.

---

## 📁 Folder Structure

```
splitai-backend/
├── server.js                   # Entry point
├── .env.example                # Environment variable template
├── package.json
├── routes/
│   └── billRoutes.js           # Route definitions
├── controllers/
│   └── billController.js       # Request orchestration
├── services/
│   └── aiService.js            # OpenAI API integration + retry logic
├── utils/
│   └── calculateSplit.js       # Bill-splitting math
└── middleware/
    ├── validateRequest.js      # Input validation
    └── errorHandler.js         # Global error handler
```

---

## 🚀 Setup

```bash
# 1. Install dependencies
npm install

# 2. Create your .env file
cp .env.example .env

# 3. Add your OpenAI API key to .env
#    Create one at: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-your-api-key-here

# 4. Start the server
npm start          # production
npm run dev        # development (nodemon)
```

---

## 📡 API Reference

### `GET /health`
Health check.

**Response**
```json
{ "status": "ok", "version": "1.0.0", "timestamp": "..." }
```

---

### `POST /split-bill`

Parses a natural-language bill description with AI and calculates who owes whom.

**Request Body**
```json
{
  "text": "Pizza shared by A and Rahul, Coke only mine, Fries for all",
  "participants": ["A", "Rahul", "Riya"],
  "prices": {
    "Pizza": 300,
    "Coke": 100,
    "Fries": 150
  }
}
```

**Success Response (200)**
```json
{
  "success": true,
  "input": { "text": "...", "participants": [...], "prices": {...} },
  "ai_parsed_items": [
    { "name": "Pizza",  "shared_by": ["A", "Rahul"] },
    { "name": "Coke",   "shared_by": ["A"] },
    { "name": "Fries",  "shared_by": ["A", "Rahul", "Riya"] }
  ],
  "enriched_items": [
    { "name": "Pizza",  "shared_by": ["A", "Rahul"], "price": 300 },
    { "name": "Coke",   "shared_by": ["A"],          "price": 100 },
    { "name": "Fries",  "shared_by": ["A", "Rahul", "Riya"], "price": 150 }
  ],
  "per_person_totals": {
    "A":     266.67,
    "Rahul": 200,
    "Riya":  50
  },
  "total_bill": 550,
  "balances": {
    "A":     83.33,
    "Rahul": 16.67,
    "Riya": -100
  },
  "transactions": [
    { "from": "A",     "to": "Riya", "amount": 83.33 },
    { "from": "Rahul", "to": "Riya", "amount": 16.67 }
  ]
}
```

**Error Response (400 — Validation)**
```json
{
  "success": false,
  "error": "Validation failed",
  "details": ["\"participants\" must be an array with at least 2 names."]
}
```

---

### `POST /split-bill/validate`

Validates the request body without making an AI call. Useful for frontend pre-checks.

---

## 🧪 Postman / curl Examples

### Example 1 — Dinner
```bash
curl -X POST http://localhost:3000/split-bill \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Pizza shared by A and Rahul, coke only mine, fries for all",
    "participants": ["A", "Rahul", "Riya"],
    "prices": { "Pizza": 300, "Coke": 100, "Fries": 150 }
  }'
```

### Example 2 — Road trip
```bash
curl -X POST http://localhost:3000/split-bill \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Petrol was split between Arjun and Sam. Lunch for everyone. Arjun paid for toll alone.",
    "participants": ["Arjun", "Sam", "Priya"],
    "prices": { "Petrol": 800, "Lunch": 600, "Toll": 120 }
  }'
```

---

## ⚙️ Environment Variables

| Variable        | Default | Description                                  |
|-----------------|---------|----------------------------------------------|
| `OPENAI_API_KEY`| —       | **Required.** OpenAI API key                 |
| `OPENAI_MODEL`  | `gpt-5.4-mini` | OpenAI model used for text and receipt scanning |
| `PORT`          | `3000`  | HTTP port                                    |
| `NODE_ENV`      | `development` | Set to `production` to suppress stack traces |
| `AI_MAX_RETRIES`| `3`     | Max retries if OpenAI returns invalid JSON   |

---

## 💡 How It Works

1. **Validation** — middleware checks all fields before anything else.
2. **AI Parsing** — `aiService.js` sends the bill description + participant list + item names to OpenAI with a strict JSON-only prompt.
3. **Retry Logic** — if OpenAI returns malformed JSON, the service retries up to `AI_MAX_RETRIES` times with exponential back-off.
4. **Split Calculation** — `calculateSplit.js` divides each item's price among its `shared_by` participants, then computes net balances and minimises the number of settlement transactions.
