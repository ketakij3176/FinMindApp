import { useState } from "react";
import { C } from "../../theme";
import { Field, inputStyle, SaveButton, Sheet } from "../ui/primitives";
import { uid } from "../../lib/finance";

export default function AddInvestmentSheet({ onClose, onSave }) {
  const [label, setLabel] = useState("");
  const [sub, setSub] = useState("");
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  function submit() {
    if (!label.trim() || !value || Number(value) <= 0) {
      setError("Add a type and a value greater than 0.");
      return;
    }
    onSave({ id: uid(), label: label.trim(), sub: sub.trim() || "—", value: Number(value) });
    onClose();
  }

  return (
    <Sheet title="Add investment" onClose={onClose}>
      <Field label="Type">
        <select value={label} onChange={(e) => setLabel(e.target.value)} style={inputStyle}>
          <option value="">Select type</option>
          {["SIP", "Mutual fund", "Stocks", "Fixed deposit", "Recurring deposit", "Other"].map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </Field>
      <Field label="Note (optional)"><input value={sub} onChange={(e) => setSub(e.target.value)} placeholder="e.g. 6 holdings, Matures Mar 2027" style={inputStyle} /></Field>
      <Field label="Value"><input type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder="0" style={inputStyle} /></Field>
      {error && <div style={{ fontSize: 12, color: C.terracotta, marginBottom: 8 }}>{error}</div>}
      <SaveButton onClick={submit} label="Add investment" />
    </Sheet>
  );
}
