/**
 * routes/billRoutes.js — All bill-splitting API routes
 */

const express = require("express");
const router = express.Router();
const billController = require("./billController");
const validateRequest = require("./validateRequest");

// POST /split-bill — main endpoint
router.post("/split-bill", validateRequest, billController.splitBill);

// POST /split-bill/validate — dry-run validation only (no AI call)
router.post("/split-bill/validate", validateRequest, billController.validateOnly);

// POST /scan-receipt - extract receipt items from an uploaded image
router.post("/scan-receipt", billController.scanReceipt);

module.exports = router;
