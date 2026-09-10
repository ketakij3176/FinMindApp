import { useEffect, useState } from "react";
import { Home, PiggyBank, Receipt, User } from "lucide-react";
import { C } from "../theme";
import { storage } from "../lib/storage";
import { EMPTY_DATA, STORAGE_KEY, useDerived } from "../lib/finance";
import Onboarding from "./Onboarding";
import HomeScreen from "./screens/HomeScreen";
import ExpensesScreen from "./screens/ExpensesScreen";
import SavingsScreen from "./screens/SavingsScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ChatPanel from "./chat/ChatPanel";
import AddExpenseSheet from "./sheets/AddExpenseSheet";
import AddInvestmentSheet from "./sheets/AddInvestmentSheet";
import AddGoalSheet from "./sheets/AddGoalSheet";
import { EmergencyFundSheet, SingleValueSheet } from "./sheets/SingleValueSheet";

const TABS = [
  { id: "home", label: "Home", icon: Home },
  { id: "savings", label: "Savings", icon: PiggyBank },
  { id: "expenses", label: "Expenses", icon: Receipt },
  { id: "profile", label: "Profile", icon: User },
];

export default function Dashboard({ user, onLogout }) {
  const [data, setData] = useState(EMPTY_DATA);
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState("home");
  const [chatOpen, setChatOpen] = useState(false);
  const [sheet, setSheet] = useState(null);
  const derived = useDerived(data);

  useEffect(() => {
    (async () => {
      const res = await storage.get(STORAGE_KEY);
      if (res && res.value) setData(JSON.parse(res.value));
      setLoaded(true);
    })();
  }, []);

  // Prefill the profile from the logged-in account once, only if it's still empty.
  // Once a real database exists this becomes the initial row for that user's record.
  useEffect(() => {
    if (!loaded) return;
    if (!data.profile.name && !data.profile.email && (user.name || user.email)) {
      setData((prev) => ({ ...prev, profile: { name: user.name || "", email: user.email || "" } }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

  function updateData(updater) {
    setData((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      storage.set(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  if (!loaded) {
    return (
      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: C.espresso + "88" }}>Loading FinMind…</span>
      </div>
    );
  }

  if (!data.onboarded) {
    return <Onboarding onDone={updateData} />;
  }

  return (
    <>
      <div style={{ height: "100%", overflowY: "auto", position: "relative" }}>
        {tab === "home" && <HomeScreen data={data} derived={derived} openChat={() => setChatOpen(true)} openSheet={setSheet} />}
        {tab === "expenses" && <ExpensesScreen data={data} derived={derived} openSheet={setSheet} removeExpense={(id) => updateData((p) => ({ ...p, expenses: p.expenses.filter((e) => e.id !== id) }))} />}
        {tab === "savings" && <SavingsScreen data={data} derived={derived} openSheet={setSheet} removeInvestment={(id) => updateData((p) => ({ ...p, investments: p.investments.filter((e) => e.id !== id) }))} />}
        {tab === "profile" && <ProfileScreen data={data} derived={derived} openChat={() => setChatOpen(true)} updateProfile={(patch) => updateData((p) => ({ ...p, profile: { ...p.profile, ...patch } }))} onLogout={onLogout} />}
      </div>

      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 84, background: C.cream, borderTop: `1px solid ${C.espresso}14`, display: "flex", alignItems: "flex-start", justifyContent: "space-around", paddingTop: 12 }}>
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, color: active ? C.terracotta : C.espresso + "66", width: 70 }}>
              <t.icon size={20} strokeWidth={active ? 2.4 : 2} />
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10.5, fontWeight: active ? 600 : 500 }}>{t.label}</span>
            </button>
          );
        })}
      </div>

      {chatOpen && <ChatPanel data={data} derived={derived} onClose={() => setChatOpen(false)} />}

      {sheet === "intro" && <Onboarding onDone={(u) => { updateData(u); setSheet(null); }} />}
      {sheet === "expense" && <AddExpenseSheet onClose={() => setSheet(null)} onSave={(e) => updateData((p) => ({ ...p, expenses: [...p.expenses, e] }))} />}
      {sheet === "investment" && <AddInvestmentSheet onClose={() => setSheet(null)} onSave={(inv) => updateData((p) => ({ ...p, investments: [...p.investments, inv] }))} />}
      {sheet === "goal" && <AddGoalSheet onClose={() => setSheet(null)} onSave={(g) => updateData((p) => ({ ...p, goals: [...p.goals, g] }))} />}
      {sheet === "income" && <SingleValueSheet title="Monthly income" label="Amount" initial={data.income} onClose={() => setSheet(null)} onSave={(v) => updateData((p) => ({ ...p, income: v }))} />}
      {sheet === "budget" && <SingleValueSheet title="Monthly budget" label="Target amount" initial={data.budgetTarget} onClose={() => setSheet(null)} onSave={(v) => updateData((p) => ({ ...p, budgetTarget: v }))} />}
      {sheet === "emergencyFund" && <EmergencyFundSheet data={data} onClose={() => setSheet(null)} onSave={(ef) => updateData((p) => ({ ...p, emergencyFund: ef }))} />}
    </>
  );
}
