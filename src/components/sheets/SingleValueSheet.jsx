import { useState } from "react";
import { C } from "../../theme";
import { Field, inputStyle, SaveButton, Sheet } from "../ui/primitives";

export function SingleValueSheet({ title, label, initial, onClose, onSave }) {
  const [value, setValue] = useState(initial || "");
  const [error, setError] = useState("");

  function submit() {
    if (!value || Number(value) < 0) { setError("Enter a valid amount."); return; }
    onSave(Number(value));
    onClose();
  }

  return (
    <Sheet title={title} onClose={onClose}>
      <Field label={label}><input type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder="0" style={inputStyle} /></Field>
      {error && <div style={{ fontSize: 12, color: C.terracotta, marginBottom: 8 }}>{error}</div>}
      <SaveButton onClick={submit} />
    </Sheet>
  );
}

export function EmergencyFundSheet({ data, onClose, onSave }) {
  const [current, setCurrent] = useState(data.emergencyFund.current || "");
  const [target, setTarget] = useState(data.emergencyFund.target || "");
  const [error, setError] = useState("");

  function submit() {
    if (!target || Number(target) <= 0) { setError("Set a target greater than 0."); return; }
    onSave({ current: Number(current) || 0, target: Number(target) });
    onClose();
  }

  return (
    <Sheet title="Emergency fund" onClose={onClose}>
      <Field label="Current amount"><input type="number" value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="0" style={inputStyle} /></Field>
      <Field label="Target (aim for ~6 months of expenses)"><input type="number" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="0" style={inputStyle} /></Field>
      {error && <div style={{ fontSize: 12, color: C.terracotta, marginBottom: 8 }}>{error}</div>}
      <SaveButton onClick={submit} />
    </Sheet>
  );
}
