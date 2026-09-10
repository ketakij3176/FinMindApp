import { X } from "lucide-react";
import { C } from "../../theme";

export function Card({ children, style, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{ background: C.cream, borderRadius: 20, padding: 16, border: `1px solid ${C.espresso}14`, cursor: onClick ? "pointer" : "default", ...style }}
    >
      {children}
    </div>
  );
}

export function ScreenTitle({ children, sub, right }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 18 }}>
      <div>
        <div style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: 26, color: C.espresso, letterSpacing: "-0.01em" }}>{children}</div>
        {sub && <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: C.espresso + "99", marginTop: 2 }}>{sub}</div>}
      </div>
      {right}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, body, actionLabel, onAction }) {
  return (
    <div style={{ border: `1.5px dashed ${C.espresso}33`, borderRadius: 20, padding: "26px 20px", textAlign: "center" }}>
      <div style={{ width: 42, height: 42, borderRadius: 14, background: C.copperLight, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
        <Icon size={19} color={C.terracotta} />
      </div>
      <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 14, color: C.espresso, marginBottom: 4 }}>{title}</div>
      <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: C.espresso + "99", lineHeight: 1.5, marginBottom: 14 }}>{body}</div>
      {onAction && (
        <button onClick={onAction} style={{ background: C.espresso, color: C.parchment, border: "none", borderRadius: 12, padding: "9px 18px", fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 12.5, cursor: "pointer" }}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 600, color: C.espresso + "99", marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  );
}

export const inputStyle = {
  width: "100%", height: 42, borderRadius: 12, border: `1px solid ${C.espresso}22`,
  background: C.cream, padding: "0 13px", fontSize: 13.5, color: C.espresso, outline: "none",
};

export function Sheet({ title, onClose, children }) {
  return (
    <div style={{ position: "absolute", inset: 0, background: C.parchment, display: "flex", flexDirection: "column", zIndex: 25 }} className="fm-panel">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 18px 14px", borderBottom: `1px solid ${C.espresso}14` }}>
        <span style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: 17, color: C.espresso }}>{title}</span>
        <button onClick={onClose} aria-label="Close" style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
          <X size={19} color={C.espresso} />
        </button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "18px 18px 24px" }}>{children}</div>
    </div>
  );
}

export function SaveButton({ onClick, label = "Save" }) {
  return (
    <button onClick={onClick} style={{ width: "100%", height: 46, borderRadius: 13, border: "none", background: C.espresso, color: C.parchment, fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13.5, cursor: "pointer", marginTop: 6 }}>
      {label}
    </button>
  );
}
