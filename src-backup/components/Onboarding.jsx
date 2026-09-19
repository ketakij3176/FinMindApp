import { useState } from "react";
import { ArrowLeft, Mic, Sparkles } from "lucide-react";
import { C } from "../theme";
import { Field, inputStyle, SaveButton } from "./ui/primitives";
import { parseFinanceText, today, uid } from "../lib/finance";

export default function Onboarding({ onDone }) {
  const [step, setStep] = useState("intro");
  const [text, setText] = useState("");
  const [parsed, setParsed] = useState({});

  function extract() {
    const found = parseFinanceText(text);
    setParsed({ income: found.income || 0, savings: found.savings || 0, sip: found.sip || 0, rd: found.rd || 0, fd: found.fd || 0, expenses: found.expenses || 0 });
    setStep("confirm");
  }

  function save() {
    onDone((prev) => ({
      ...prev,
      onboarded: true,
      income: parsed.income,
      cash: prev.cash + parsed.savings,
      budgetTarget: parsed.expenses,
      investments: [
        ...prev.investments,
        ...(parsed.sip > 0 ? [{ id: uid(), label: "SIP", sub: "Monthly contribution", value: parsed.sip }] : []),
        ...(parsed.rd > 0 ? [{ id: uid(), label: "Recurring deposit", sub: "Monthly contribution", value: parsed.rd }] : []),
        ...(parsed.fd > 0 ? [{ id: uid(), label: "Fixed deposit", sub: "Lump sum", value: parsed.fd }] : []),
      ],
      expenses: parsed.expenses > 0
        ? [...prev.expenses, { id: uid(), merchant: "Monthly expenses (estimated)", category: "General", amount: -parsed.expenses, date: today() }]
        : prev.expenses,
    }));
  }

  const field = (label, key) => (
    <Field label={label}>
      <input type="number" value={parsed[key]} onChange={(e) => setParsed((p) => ({ ...p, [key]: Number(e.target.value) }))} style={inputStyle} placeholder="0" />
    </Field>
  );

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", padding: "40px 22px 28px" }}>
      {step === "intro" ? (
        <>
          <Sparkles size={26} color={C.terracotta} />
          <div style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: 25, color: C.espresso, marginTop: 14, lineHeight: 1.2 }}>
            Let's get to know your money
          </div>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: C.espresso + "99", marginTop: 8, lineHeight: 1.55 }}>
            Tell FinMind about your income, savings, and expenses in your own words — like you're explaining it to a friend. FinMind will turn it into structured data for you to confirm.
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`e.g. "I earn ₹60,000 a month. I have ₹2 lakh in savings. I have two SIPs totaling ₹8,000 per month, an RD of ₹3,000 and an FD of ₹1 lakh. My expenses are around ₹25,000 a month."`}
            style={{ ...inputStyle, height: 150, marginTop: 20, padding: 13, lineHeight: 1.5, resize: "none" }}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button aria-label="Speak" style={{ width: 42, height: 42, borderRadius: 13, border: `1px solid ${C.espresso}22`, background: C.cream, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
              <Mic size={17} color={C.espresso} />
            </button>
            <button
              onClick={extract}
              disabled={!text.trim()}
              style={{ flex: 1, height: 42, borderRadius: 13, border: "none", background: text.trim() ? C.espresso : C.espresso + "55", color: C.parchment, fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13, cursor: text.trim() ? "pointer" : "default" }}
            >
              Extract my finances
            </button>
          </div>
          <button
            onClick={() => onDone((prev) => ({ ...prev, onboarded: true }))}
            style={{ background: "none", border: "none", color: C.espresso + "88", fontFamily: "Inter, sans-serif", fontSize: 12.5, marginTop: 16, cursor: "pointer", textDecoration: "underline" }}
          >
            Skip, I'll add everything manually
          </button>
        </>
      ) : (
        <>
          <button onClick={() => setStep("intro")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: C.espresso + "99", fontFamily: "Inter, sans-serif", fontSize: 12.5, padding: 0, marginBottom: 16 }}>
            <ArrowLeft size={14} /> Back
          </button>
          <div style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: 21, color: C.espresso, marginBottom: 4 }}>Here's what I found</div>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: C.espresso + "99", marginBottom: 18, lineHeight: 1.5 }}>
            Check these over and adjust anything before saving.
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            {field("Monthly income", "income")}
            {field("Current savings (cash)", "savings")}
            {field("SIP, per month", "sip")}
            {field("RD, per month", "rd")}
            {field("FD, lump sum", "fd")}
            {field("Monthly expenses (estimate)", "expenses")}
          </div>
          <SaveButton onClick={save} label="Looks good, save and continue" />
        </>
      )}
    </div>
  );
}
