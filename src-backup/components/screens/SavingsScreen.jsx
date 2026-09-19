import { Coins, LineChart, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { C } from "../../theme";
import { Card, EmptyState, ScreenTitle } from "../ui/primitives";
import { money } from "../../lib/finance";

export default function SavingsScreen({ data, derived, openSheet, removeInvestment }) {
  const efPct = data.emergencyFund.target > 0 ? Math.round((data.emergencyFund.current / data.emergencyFund.target) * 100) : 0;

  return (
    <div style={{ padding: "22px 18px 110px" }}>
      <ScreenTitle sub="Track everything you own">Savings & wealth</ScreenTitle>

      <div style={{ background: C.espresso, borderRadius: 24, padding: "20px 20px", marginBottom: 14 }}>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: C.parchment + "aa" }}>NET WORTH</div>
        <div style={{ fontFamily: "IBM Plex Mono, monospace", fontWeight: 600, fontSize: 28, color: C.parchment, marginTop: 4 }}>{money(derived.totalAssets)}</div>
      </div>

      <Card onClick={() => openSheet("emergencyFund")} style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <ShieldCheck size={16} color={C.moss} />
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13.5, color: C.espresso }}>Emergency fund</span>
        </div>
        {data.emergencyFund.target > 0 ? (
          <>
            <div style={{ height: 8, background: C.parchment, borderRadius: 999, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${Math.min(100, efPct)}%`, background: C.moss, borderRadius: 999 }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
              <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 12, color: C.espresso }}>{money(data.emergencyFund.current)} <span style={{ color: C.espresso + "77" }}>of {money(data.emergencyFund.target)}</span></span>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5, color: C.espresso + "88" }}>{efPct}%</span>
            </div>
          </>
        ) : (
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: C.espresso + "99" }}>Not set yet — tap to add a target (aim for ~6 months of expenses).</div>
        )}
      </Card>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 12.5, color: C.espresso + "99" }}>INVESTMENTS</span>
        <button onClick={() => openSheet("investment")} style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", color: C.terracotta, fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
          <Plus size={13} /> Add
        </button>
      </div>
      {data.investments.length === 0 ? (
        <EmptyState icon={LineChart} title="No investments added" body="Add your SIPs, mutual funds, stocks, FDs, or RDs to see your full financial picture." actionLabel="Add an investment" onAction={() => openSheet("investment")} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {data.investments.map((inv) => (
            <Card key={inv.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                <div style={{ width: 36, height: 36, borderRadius: 11, background: C.copperLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Coins size={16} color={C.terracotta} />
                </div>
                <div>
                  <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 500, color: C.espresso }}>{inv.label}</div>
                  <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: C.espresso + "77" }}>{inv.sub}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 13, fontWeight: 500, color: C.espresso }}>{money(inv.value)}</span>
                <button onClick={() => removeInvestment(inv.id)} aria-label="Delete" style={{ background: "none", border: "none", cursor: "pointer", padding: 2, opacity: 0.5 }}>
                  <Trash2 size={13} color={C.espresso} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
