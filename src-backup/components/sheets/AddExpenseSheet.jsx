import { useState } from "react";
import { C } from "../../theme";
import { Field, inputStyle, SaveButton, Sheet } from "../ui/primitives";
import { autoCategorize, CATEGORY_OPTIONS, today, uid } from "../../lib/finance";

export default function AddExpenseSheet({ onClose, onSave }) {
  const [merchant, setMerchant] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  function handleMerchant(v) {
    setMerchant(v);
    if (!category && v.trim()) setCategory(autoCategorize(v));
  }

  function submit() {
    if (!merchant.trim() || !amount || Number(amount) <= 0) {
      setError("Add a merchant and an amount greater than 0.");
      return;
    }
    onSave({ id: uid(), merchant: merchant.trim(), category: category || "Other", amount: -Math.abs(Number(amount)), date: today() });
    onClose();
  }

  return (
    <Sheet title="Add expense" onClose={onClose}>
      <Field label="Merchant or description">
        <input value={merchant} onChange={(e) => handleMerchant(e.target.value)} placeholder="e.g. SWIGGY" style={inputStyle} />
      </Field>
      <Field label="Category">
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
          <option value="">Select a category</option>
          {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </Field>
      <Field label="Amount">
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" style={inputStyle} />
      </Field>
      {error && <div style={{ fontSize: 12, color: C.terracotta, marginBottom: 8 }}>{error}</div>}
      <SaveButton onClick={submit} label="Add expense" />
    </Sheet>
  );
}
