import { C } from "../../theme";
import { extractRupeeAmount, KNOWN_PRODUCT_PRICES, money } from "../../lib/finance";

// This function is the entire "AI" for now — pattern matching plus arithmetic
// on the user's real data. It exists so the UI, chat flow, and gauge card are
// fully built and testable before Stage 7 swaps this out for real Claude tool
// calls (query_income, query_expenses, calculate_affordability, etc.) as
// described in the FinMind AI architecture doc.
export function botReplyFor(text, data, derived) {
  const t = text.toLowerCase();

  if (t.includes("afford") || t.includes("iphone") || t.includes("phone")) {
    let amount = extractRupeeAmount(text);
    if (!amount) {
      const known = Object.entries(KNOWN_PRODUCT_PRICES).find(([k]) => t.includes(k.split(" ")[0]));
      if (known) amount = known[1];
    }
    if (!amount) {
      return { role: "bot", type: "text", body: "How much does it cost? Mention an amount, like \"Can I afford a ₹40,000 phone?\", and I'll check it against your cash and emergency fund." };
    }
    if (data.cash === 0 && data.income === 0) {
      return { role: "bot", type: "text", body: "I don't have your income or savings yet. Add them from Home or Profile and ask me again." };
    }
    const efTarget = data.emergencyFund.target || 0;
    const spareAboveEf = Math.max(0, data.cash - efTarget);
    const postPurchase = data.cash - amount;
    const verdict = postPurchase >= efTarget ? "comfortable" : postPurchase >= 0 ? "planning" : "not";
    const fcf = derived.freeCashFlow;
    let monthsToSave = null;
    if (verdict !== "comfortable" && fcf && fcf > 0) {
      const shortfall = amount - spareAboveEf;
      monthsToSave = shortfall > 0 ? Math.ceil(shortfall / fcf) : 0;
    }
    const bodyMap = {
      comfortable: `You have ${money(data.cash)} in cash, well above your ${money(efTarget)} emergency fund target. Buying this for ${money(amount)} still leaves your safety net intact.`,
      planning: `You have ${money(data.cash)} in cash. Buying this now for ${money(amount)} would leave you below your ${money(efTarget)} emergency fund target.${monthsToSave ? ` At your current pace, waiting about ${monthsToSave} month${monthsToSave === 1 ? "" : "s"} would let you buy it without dipping into your safety net.` : ""}`,
      not: `You have ${money(data.cash)} in cash, and this costs ${money(amount)} — buying it now would leave you with a shortfall against your ${money(efTarget)} emergency fund target and little cushion left.${monthsToSave ? ` Saving for about ${monthsToSave} months first is the safer route.` : ""}`,
    };
    return {
      role: "bot", type: "verdict", verdict,
      title: `${money(amount)} purchase`,
      body: bodyMap[verdict],
      stats: [
        ["Cash available", money(data.cash), C.espresso],
        ["Emergency fund target", money(efTarget), C.espresso],
        ["Free cash flow / month", fcf != null ? money(fcf) : "Unknown", C.copper],
      ],
    };
  }

  if (t.includes("spend") || t.includes("why")) {
    if (derived.categoryList.length === 0) {
      return { role: "bot", type: "text", body: "You haven't logged any expenses yet — add a few and I can break down where your money's going." };
    }
    const top = derived.categoryList[0];
    return { role: "bot", type: "text", body: `Your biggest category this month is ${top.name} at ${money(top.amount)}, out of ${money(derived.spent)} total spent. Log a full month or two and I'll be able to compare trends over time.` };
  }

  if (t.includes("sip")) {
    const newSip = extractRupeeAmount(text);
    const currentSip = data.investments.filter((i) => i.label === "SIP").reduce((s, i) => s + i.value, 0);
    if (!newSip) {
      return { role: "bot", type: "text", body: `Your current SIP total is ${money(currentSip)}/month. Tell me the new amount, like "What if I increase my SIP to ₹8,000?"` };
    }
    const diff = newSip - currentSip;
    const yearly = diff * 12;
    return {
      role: "bot", type: "text",
      body: `Moving your SIP from ${money(currentSip)} to ${money(newSip)} a month means ${diff >= 0 ? "committing" : "freeing up"} ${money(Math.abs(diff))} more each month — about ${money(Math.abs(yearly))} over a year. ${derived.freeCashFlow != null ? `Your current free cash flow is ${money(derived.freeCashFlow)}/month, so ${diff <= derived.freeCashFlow ? "this fits comfortably" : "this would stretch your budget"}.` : ""}`,
    };
  }

  if (t.includes("how am i") || t.includes("doing")) {
    if (data.income === 0) {
      return { role: "bot", type: "text", body: "Add your income and log some expenses, and I'll give you a real read on how you're doing." };
    }
    const rate = derived.freeCashFlow != null ? Math.round((derived.freeCashFlow / data.income) * 100) : null;
    return { role: "bot", type: "text", body: `You've saved ${money(derived.freeCashFlow || 0)} out of ${money(data.income)} earned this month${rate != null ? ` — a savings rate of ${rate}%` : ""}. Your financial health score is ${derived.healthScore != null ? `${derived.healthScore}/100` : "not available yet"}.` };
  }

  return { role: "bot", type: "text", body: "I can look into that using your income, expenses, savings, and goals. Try asking about affordability with a specific amount, a what-if scenario, or your spending pattern." };
}

export const SUGGESTIONS = [
  "Can I afford an iPhone 17 Pro Max?",
  "Why did my spending increase?",
  "What if I increase my SIP to ₹8,000?",
  "How am I doing this month?",
];
