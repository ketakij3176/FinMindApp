import { useMemo } from "react";

export const STORAGE_KEY = "finmind-data";
export const AUTH_KEY = "finmind-auth";

export const money = (n) => "₹" + Math.round(n || 0).toLocaleString("en-IN");
export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
export const today = () => new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short" });

export const EMPTY_DATA = {
  onboarded: false,
  profile: { name: "", email: "" },
  income: 0,
  cash: 0,
  budgetTarget: 0,
  emergencyFund: { current: 0, target: 0 },
  expenses: [],
  investments: [],
  goals: [],
};

const MERCHANT_MAP = [
  [/swiggy|zomato/i, "Food"],
  [/blinkit|zepto|instamart|bigbasket/i, "Groceries"],
  [/amazon|flipkart|myntra|ajio/i, "Shopping"],
  [/uber|ola|rapido/i, "Transport"],
  [/netflix|prime|hotstar|spotify|jiocinema/i, "Entertainment"],
  [/electricity|water board|broadband|wifi|rent|landlord/i, "Bills"],
  [/hospital|pharmacy|clinic|apollo/i, "Health"],
];
export const autoCategorize = (merchant) => {
  for (const [re, cat] of MERCHANT_MAP) if (re.test(merchant)) return cat;
  return "Other";
};

export const CATEGORY_OPTIONS = ["Food", "Groceries", "Shopping", "Transport", "Bills", "Entertainment", "Health", "Education", "General", "Other"];

export const CATEGORY_COLORS = {
  Food: "#A04000", Groceries: "#6B7A4F", Shopping: "#CA6F1E", Transport: "#8C6A56",
  Bills: "#2B1B17", Entertainment: "#B98A5A", Health: "#7A6C5D", Education: "#6E5A46",
  General: "#9A9184", Other: "#9A9184",
};

export const KNOWN_PRODUCT_PRICES = { "iphone 17 pro max": 149900, "iphone 16": 79900 };

// Turns a free-text description of someone's finances into structured fields.
// This is a lightweight stand-in for what a real LLM extraction call will do
// once the AI backend (Stage 7) is wired up.
export function parseFinanceText(text) {
  const found = {};
  const re = /₹?\s?([\d][\d,]*(?:\.\d+)?)\s*(lakh|lac|k)?/gi;
  let m;
  while ((m = re.exec(text)) !== null) {
    let val = parseFloat(m[1].replace(/,/g, ""));
    const unit = (m[2] || "").toLowerCase();
    if (unit === "lakh" || unit === "lac") val *= 100000;
    else if (unit === "k") val *= 1000;
    const start = Math.max(0, m.index - 30);
    const end = Math.min(text.length, m.index + m[0].length + 20);
    const ctx = text.slice(start, end).toLowerCase();
    if (/earn|income|salary/.test(ctx) && found.income === undefined) found.income = val;
    else if (/sip/.test(ctx) && found.sip === undefined) found.sip = val;
    else if (/\brd\b|recurring deposit/.test(ctx) && found.rd === undefined) found.rd = val;
    else if (/\bfd\b|fixed deposit/.test(ctx) && found.fd === undefined) found.fd = val;
    else if (/saving/.test(ctx) && found.savings === undefined) found.savings = val;
    else if (/expense|spend/.test(ctx) && found.expenses === undefined) found.expenses = val;
  }
  return found;
}

export function extractRupeeAmount(text) {
  const m = text.match(/₹\s?([\d][\d,]*(?:\.\d+)?)\s*(lakh|lac|k)?/i);
  if (!m) return null;
  let val = parseFloat(m[1].replace(/,/g, ""));
  const unit = (m[2] || "").toLowerCase();
  if (unit === "lakh" || unit === "lac") val *= 100000;
  else if (unit === "k") val *= 1000;
  return val;
}

// All the numbers screens and chat need, computed once per data change.
export function useDerived(data) {
  return useMemo(() => {
    const spent = data.expenses.filter((e) => e.amount < 0).reduce((s, e) => s + Math.abs(e.amount), 0);
    const totalInvestments = data.investments.reduce((s, i) => s + (i.value || 0), 0);
    const totalAssets = data.cash + totalInvestments + data.emergencyFund.current;
    const freeCashFlow = data.income > 0 ? data.income - spent : null;

    const categories = {};
    data.expenses.forEach((e) => {
      if (e.amount >= 0) return;
      const cat = e.category || "Other";
      categories[cat] = (categories[cat] || 0) + Math.abs(e.amount);
    });
    const categoryList = Object.entries(categories)
      .map(([name, amount]) => ({ name, amount, color: CATEGORY_COLORS[name] || "#9A9184" }))
      .sort((a, b) => b.amount - a.amount);

    let healthScore = null;
    if (data.income > 0) {
      const savingsRate = Math.max(0, Math.min(1, (data.income - spent) / data.income));
      const efRatio = data.emergencyFund.target > 0 ? Math.min(1, data.emergencyFund.current / data.emergencyFund.target) : 0.3;
      const goalRatio = data.goals.length
        ? data.goals.reduce((s, g) => s + Math.min(1, g.current / (g.target || 1)), 0) / data.goals.length
        : 0.5;
      healthScore = Math.round(savingsRate * 45 + efRatio * 35 + goalRatio * 20);
      healthScore = Math.max(0, Math.min(100, healthScore));
    }

    return { spent, totalInvestments, totalAssets, freeCashFlow, categoryList, healthScore };
  }, [data]);
}
