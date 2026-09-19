import { AlertTriangle, ArrowDownRight, ArrowUpRight, Mic, Plus, Sparkles, Target, TrendingUp } from "lucide-react";
import { C, dotGrid } from "../../theme";
import { Card, EmptyState } from "../ui/primitives";
import { money } from "../../lib/finance";

export default function HomeScreen({ data, derived, openChat, openSheet }) {
  const firstGoal = data.goals[0];
  const hasName = data.profile.name.trim().length > 0;

  return (
    <div style={{ padding: "22px 18px 110px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: C.espresso + "88" }}>Good to see you</div>
          <div style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: 22, color: C.espresso }}>{hasName ? data.profile.name.split(" ")[0] : "there"}</div>
        </div>
        <button onClick={openChat} style={{ width: 42, height: 42, borderRadius: 14, border: "none", background: C.espresso, color: C.parchment, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} aria-label="Ask FinMind AI">
          <Sparkles size={19} />
        </button>
      </div>

      <div style={{ background: C.espresso, borderRadius: 24, padding: "22px 20px", marginBottom: 14, ...dotGrid, backgroundBlendMode: "soft-light" }}>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: C.parchment + "aa", letterSpacing: "0.03em" }}>TOTAL FINANCIAL ASSETS</div>
        <div style={{ fontFamily: "IBM Plex Mono, monospace", fontWeight: 600, fontSize: 32, color: C.parchment, marginTop: 4 }}>{money(derived.totalAssets)}</div>
        <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
          {[["Cash", data.cash], ["Investments", derived.totalInvestments], ["Emergency fund", data.emergencyFund.current]].map(([label, val]) => (
            <div key={label} style={{ background: "#ffffff14", borderRadius: 12, padding: "8px 10px", flex: "1 1 auto" }}>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: C.parchment + "99" }}>{label}</div>
              <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 13, color: C.parchment, fontWeight: 500 }}>{money(val)}</div>
            </div>
          ))}
        </div>
      </div>

      {data.income === 0 ? (
        <Card onClick={() => openSheet("income")} style={{ marginBottom: 14, borderLeft: `3px solid ${C.copper}`, borderRadius: 16 }}>
          <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13, color: C.espresso }}>Add your monthly income</div>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: C.espresso + "99", marginTop: 2 }}>FinMind needs this to tell you what you can comfortably afford.</div>
        </Card>
      ) : (
        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          {[["Income", data.income, ArrowUpRight, C.moss], ["Spent", derived.spent, ArrowDownRight, C.terracotta], ["Saved", data.income - derived.spent, TrendingUp, C.copper]].map(([label, val, Icon, color]) => (
            <Card key={label} style={{ flex: 1, padding: 12 }}>
              <Icon size={14} color={color} />
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: C.espresso + "88", marginTop: 6 }}>{label}</div>
              <div style={{ fontFamily: "IBM Plex Mono, monospace", fontWeight: 600, fontSize: 14, color: C.espresso }}>{money(val)}</div>
            </Card>
          ))}
        </div>
      )}

      {derived.categoryList.length > 0 ? (
        <Card onClick={openChat} style={{ borderLeft: `3px solid ${C.terracotta}`, borderRadius: 16, marginBottom: 14 }}>
          <div style={{ display: "flex", gap: 10 }}>
            <AlertTriangle size={17} color={C.terracotta} style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13, color: C.espresso }}>{derived.categoryList[0].name} is your top spend</div>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: C.espresso + "aa", marginTop: 2, lineHeight: 1.5 }}>{money(derived.categoryList[0].amount)} this month. Tap to ask FinMind about it.</div>
            </div>
          </div>
        </Card>
      ) : (
        <Card style={{ marginBottom: 14, textAlign: "center", padding: 18 }}>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: C.espresso + "88" }}>Log a few expenses and FinMind will start surfacing insights here.</div>
        </Card>
      )}

      {firstGoal ? (
        <Card style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Target size={16} color={C.copper} />
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13.5, color: C.espresso }}>{firstGoal.name}</span>
            </div>
            <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 12, color: C.espresso + "88" }}>{Math.round((firstGoal.current / firstGoal.target) * 100)}%</span>
          </div>
          <div style={{ height: 8, background: C.parchment, borderRadius: 999, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${Math.min(100, (firstGoal.current / firstGoal.target) * 100)}%`, background: `linear-gradient(90deg, ${C.terracotta}, ${C.copper})`, borderRadius: 999 }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 12, color: C.espresso }}>{money(firstGoal.current)} <span style={{ color: C.espresso + "77" }}>of {money(firstGoal.target)}</span></span>
            {firstGoal.targetDate && <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5, color: C.espresso + "88" }}>by {firstGoal.targetDate}</span>}
          </div>
        </Card>
      ) : (
        <div style={{ marginBottom: 14 }}>
          <EmptyState icon={Target} title="No goals yet" body="Set a savings target — a phone, a trip, a house — and FinMind will track your progress." actionLabel="Create a goal" onAction={() => openSheet("goal")} />
        </div>
      )}

      <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 12.5, color: C.espresso + "99", marginBottom: 8, letterSpacing: "0.02em" }}>QUICK ACTIONS</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {[["Add expense", Plus, () => openSheet("expense")], ["Log by voice", Mic, () => openSheet("intro")], ["Ask FinMind", Sparkles, openChat], ["View goals", Target, () => openSheet("goal")]].map(([label, Icon, action]) => (
          <Card key={label} onClick={action} style={{ display: "flex", alignItems: "center", gap: 9, padding: "13px 12px" }}>
            <div style={{ width: 30, height: 30, borderRadius: 10, background: C.copperLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon size={15} color={C.terracotta} />
            </div>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, fontWeight: 500, color: C.espresso }}>{label}</span>
          </Card>
        ))}
      </div>
    </div>
  );
}
