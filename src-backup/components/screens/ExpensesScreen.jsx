import { Plus, Receipt, Trash2 } from "lucide-react";
import { C } from "../../theme";
import { Card, EmptyState, ScreenTitle } from "../ui/primitives";
import { money } from "../../lib/finance";

export default function ExpensesScreen({ data, derived, openSheet, removeExpense }) {
  const total = derived.spent;
  const pctOfBudget = data.budgetTarget > 0 ? Math.min(100, Math.round((total / data.budgetTarget) * 100)) : 0;

  return (
    <div style={{ padding: "22px 18px 110px" }}>
      <ScreenTitle sub="This month">Expenses</ScreenTitle>

      <Card style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5, color: C.espresso + "88" }}>Spent this month</div>
            <div style={{ fontFamily: "IBM Plex Mono, monospace", fontWeight: 600, fontSize: 26, color: C.espresso }}>{money(total)}</div>
          </div>
          <div onClick={() => openSheet("budget")} style={{ textAlign: "right", cursor: "pointer" }}>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5, color: C.espresso + "88" }}>Budget</div>
            <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 13, color: data.budgetTarget ? C.espresso + "aa" : C.terracotta }}>{data.budgetTarget ? money(data.budgetTarget) : "Set target"}</div>
          </div>
        </div>
        {data.budgetTarget > 0 && (
          <>
            <div style={{ height: 7, background: C.parchment, borderRadius: 999, marginTop: 12, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pctOfBudget}%`, background: pctOfBudget > 90 ? C.terracotta : C.copper, borderRadius: 999 }} />
            </div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5, color: C.espresso + "77", marginTop: 6 }}>{pctOfBudget}% of monthly budget used</div>
          </>
        )}
      </Card>

      {derived.categoryList.length > 0 && (
        <>
          <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 12.5, color: C.espresso + "99", marginBottom: 8 }}>BY CATEGORY</div>
          <Card style={{ marginBottom: 14 }}>
            {derived.categoryList.map((c, i) => (
              <div key={c.name} style={{ marginBottom: i === derived.categoryList.length - 1 ? 0 : 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 3, background: c.color }} />
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: C.espresso }}>{c.name}</span>
                  </div>
                  <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 12.5, color: C.espresso }}>{money(c.amount)}</span>
                </div>
                <div style={{ height: 5, background: C.parchment, borderRadius: 999, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(c.amount / total) * 100}%`, background: c.color, borderRadius: 999 }} />
                </div>
              </div>
            ))}
          </Card>
        </>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 12.5, color: C.espresso + "99" }}>TRANSACTIONS</span>
        <button onClick={() => openSheet("expense")} style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", color: C.terracotta, fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
          <Plus size={13} /> Add
        </button>
      </div>
      {data.expenses.length === 0 ? (
        <EmptyState icon={Receipt} title="No expenses logged yet" body="Add your first expense manually, or import a bank statement soon." actionLabel="Add an expense" onAction={() => openSheet("expense")} />
      ) : (
        <Card>
          {[...data.expenses].reverse().map((t, i) => (
            <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderTop: i === 0 ? "none" : `1px solid ${C.espresso}0f` }}>
              <div>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, fontWeight: 500, color: C.espresso }}>{t.merchant}</div>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: C.espresso + "77" }}>{t.category} · {t.date}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 12.5, color: t.amount < 0 ? C.terracotta : C.moss }}>{money(t.amount)}</span>
                <button onClick={() => removeExpense(t.id)} aria-label="Delete" style={{ background: "none", border: "none", cursor: "pointer", padding: 2, opacity: 0.5 }}>
                  <Trash2 size={13} color={C.espresso} />
                </button>
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
