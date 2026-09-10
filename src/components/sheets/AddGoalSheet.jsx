import { useState } from "react";
import { C } from "../../theme";
import { Field, inputStyle, SaveButton, Sheet } from "../ui/primitives";
import { uid } from "../../lib/finance";

export default function AddGoalSheet({ onClose, onSave }) {
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [current, setCurrent] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");

  function submit() {
    if (!name.trim() || !target || Number(target) <= 0) {
      setError("Add a goal name and a target amount greater than 0.");
      return;
    }
    onSave({ id: uid(), name: name.trim(), target: Number(target), current: Number(current) || 0, targetDate: date || "" });
    onClose();
  }

  return (
    <Sheet title="New goal" onClose={onClose}>
      <Field label="Goal name"><input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. iPhone 17 Pro Max" style={inputStyle} /></Field>
      <Field label="Target amount"><input type="number" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="0" style={inputStyle} /></Field>
      <Field label="Already saved"><input type="number" value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="0" style={inputStyle} /></Field>
      <Field label="Target date"><input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={inputStyle} /></Field>
      {error && <div style={{ fontSize: 12, color: C.terracotta, marginBottom: 8 }}>{error}</div>}
      <SaveButton onClick={submit} label="Create goal" />
    </Sheet>
  );
}
