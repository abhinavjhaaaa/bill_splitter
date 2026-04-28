/**
 * utils/calculateSplit.js
 * Core bill-splitting logic.
 *
 * Given participants and a list of enriched items (with price + shared_by),
 * returns:
 *   - balances: net amount each person owes (+) or is owed (-) vs the payer
 *   - transactions: minimal list of "who pays whom how much"
 */

/**
 * Round to 2 decimal places to avoid floating-point noise.
 */
function round2(n) {
  return Math.round(n * 100) / 100;
}

/**
 * Minimise the number of transactions needed to settle all debts.
 * Uses a greedy creditor/debtor approach.
 *
 * @param {Record<string, number>} balances  positive = owes money, negative = is owed money
 * @returns {Array<{ from: string, to: string, amount: number }>}
 */
function minimiseTransactions(balances) {
  // Separate into debtors (positive balance) and creditors (negative balance)
  const debtors = [];
  const creditors = [];

  for (const [person, balance] of Object.entries(balances)) {
    if (balance > 0.01) debtors.push({ person, amount: balance });
    else if (balance < -0.01) creditors.push({ person, amount: -balance }); // make positive
  }

  const transactions = [];

  let d = 0;
  let c = 0;

  while (d < debtors.length && c < creditors.length) {
    const debtor = debtors[d];
    const creditor = creditors[c];
    const settleAmount = round2(Math.min(debtor.amount, creditor.amount));

    if (settleAmount > 0) {
      transactions.push({
        from: debtor.person,
        to: creditor.person,
        amount: settleAmount,
      });
    }

    debtor.amount = round2(debtor.amount - settleAmount);
    creditor.amount = round2(creditor.amount - settleAmount);

    if (debtor.amount < 0.01) d++;
    if (creditor.amount < 0.01) c++;
  }

  return transactions;
}

/**
 * Main calculation function.
 *
 * @param {string[]} participants  All participant names
 * @param {Array<{ name: string, price: number, shared_by: string[] }>} items
 * @returns {{
 *   balances: Record<string, number>,
 *   transactions: Array<{ from: string, to: string, amount: number }>,
 *   per_person_totals: Record<string, number>,
 *   total_bill: number
 * }}
 */
function calculateSplit(participants, items) {
  // Initialise per-person spending totals
  const perPerson = {};
  participants.forEach((p) => (perPerson[p] = 0));

  let totalBill = 0;

  for (const item of items) {
    const price = Number(item.price) || 0;
    const sharedBy = item.shared_by || [];

    if (sharedBy.length === 0) {
      console.warn(`⚠️  Item "${item.name}" has no shared_by — skipping.`);
      continue;
    }

    const share = round2(price / sharedBy.length);
    totalBill += price;

    for (const person of sharedBy) {
      if (perPerson[person] === undefined) {
        // Participant mentioned in item but not in the original list — add them
        console.warn(`⚠️  Unknown participant "${person}" found in item "${item.name}" — adding.`);
        perPerson[person] = 0;
      }
      perPerson[person] = round2(perPerson[person] + share);
    }
  }

  totalBill = round2(totalBill);

  // ── Determine who "paid" (the one who advanced the full bill) ───────────────
  // In this model we assume a single payer covered the entire bill.
  // The payer has a negative balance (they are owed money);
  // everyone else has a positive balance (they owe money to the payer).
  //
  // If no explicit payer was designated we identify the payer as whoever
  // has the highest individual share — a reasonable heuristic for when the
  // text doesn't specify.  The frontend can pass a "payer" field to override.

  // For now: build raw balances (each person owes their share of the bill).
  // The payer "paid" totalBill, so their balance = share - totalBill.
  // Everyone else balance = share (they owe this much to the payer).
  //
  // Since we don't have a designated payer in this endpoint format, we return
  // per-person totals and let the caller derive net balances if needed.
  // We also produce "creditor vs debtor" balances assuming the person who
  // spent the LEAST overall is the payer — but this is overridable.

  // ── Simpler model: "group pool" approach ───────────────────────────────────
  // Equal-split of TOTAL is NOT what we want; we want item-level fairness.
  // Balances = (average share of total) - (actual personal total).
  //   > 0  → person owes money into the pool
  //   < 0  → person is owed money from the pool

  const avgShare = round2(totalBill / Object.keys(perPerson).length);

  const balances = {};
  for (const [person, spent] of Object.entries(perPerson)) {
    balances[person] = round2(spent - avgShare);
  }

  const transactions = minimiseTransactions(balances);

  return {
    per_person_totals: perPerson,
    total_bill: totalBill,
    balances,
    transactions,
  };
}

module.exports = { calculateSplit, minimiseTransactions, round2 };
