import { Award, ChevronRight, Lock, Settings, Sparkles, Target } from "lucide-react";
import { C, dotGrid } from "../../theme";
import { Card, inputStyle, ScreenTitle } from "../ui/primitives";
import { HealthRing } from "../ui/HealthRing";

export default function ProfileScreen({ data, derived, openChat, updateProfile, onLogout }) {
  const initials = data.profile.name.trim() ? data.profile.name.trim().split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase() : "?";

  return (
    <div style={{ padding: "22px 18px 110px" }}>
      <ScreenTitle>Profile</ScreenTitle>

      <Card style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: C.espresso, color: C.parchment, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: 17, flexShrink: 0 }}>
            {initials}
          </div>
          <div style={{ flex: 1 }}>
            <input value={data.profile.name} onChange={(e) => updateProfile({ name: e.target.value })} placeholder="Your name" style={{ ...inputStyle, height: 34, marginBottom: 6, fontWeight: 600 }} />
            <input value={data.profile.email} onChange={(e) => updateProfile({ email: e.target.value })} placeholder="you@email.com" style={{ ...inputStyle, height: 34, fontSize: 12 }} />
          </div>
        </div>
      </Card>

      <Card style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 14 }}>
        <HealthRing score={derived.healthScore} />
        <div>
          <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13.5, color: C.espresso }}>Financial health score</div>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: C.espresso + "99", marginTop: 3, lineHeight: 1.5 }}>
            {derived.healthScore == null ? "Add your income and a few expenses to see your score." : "A FinMind metric based on your savings rate, emergency fund, and goal progress."}
          </div>
        </div>
      </Card>

      <Card onClick={openChat} style={{ background: C.espresso, marginBottom: 14, ...dotGrid, backgroundBlendMode: "soft-light" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <Sparkles size={17} color={C.parchment} />
          <span style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: 16, color: C.parchment }}>Ask FinMind AI</span>
        </div>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: C.parchment + "bb", lineHeight: 1.5 }}>Get a reasoned answer on what you can afford, run a what-if, or ask about your spending.</div>
      </Card>

      <Card style={{ padding: 0, overflow: "hidden" }}>
        {[["Goals", Target], ["Achievements", Award], ["Settings", Settings], ["Privacy", Lock]].map(([label, Icon], i, arr) => (
          <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: i === arr.length - 1 ? "none" : `1px solid ${C.espresso}0f`, cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
              <Icon size={16} color={C.terracotta} />
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13.5, color: C.espresso }}>{label}</span>
            </div>
            <ChevronRight size={15} color={C.espresso + "55"} />
          </div>
        ))}
      </Card>

      <button
        onClick={onLogout}
        style={{ width: "100%", background: "none", border: "none", color: C.terracotta, fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13, cursor: "pointer", marginTop: 18, padding: "10px 0" }}
      >
        Log out
      </button>
    </div>
  );
}
