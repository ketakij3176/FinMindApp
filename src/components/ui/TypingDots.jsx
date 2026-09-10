import { C } from "../../theme";

export function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 4, padding: "10px 4px" }}>
      {[0, 1, 2].map((i) => (
        <div key={i} className="fm-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: C.espresso + "66", animationDelay: `${i * 0.15}s` }} />
      ))}
    </div>
  );
}
