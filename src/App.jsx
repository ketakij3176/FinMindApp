import { useEffect, useState } from "react";
import { C } from "./theme";
import { supabase } from "./lib/supabaseClient";
import LoginScreen from "./components/LoginScreen";
import Dashboard from "./components/Dashboard";

function mapSupabaseUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "User",
    email: user.email,
    avatar: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
  };
}

export default function App() {
  const [auth, setAuth] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    // 1. Check for a session that already exists (returning user, or the
    //    tail end of an OAuth redirect that just completed).
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) console.error("[FinMind] getSession error:", error.message);
      setAuth(mapSupabaseUser(data.session?.user));
      setAuthChecked(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuth(mapSupabaseUser(session?.user));
      setAuthChecked(true);
    });

    return () => listener.subscription.unsubscribe();
  }, []);
  

  async function handleLogin() {
    setAuthError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) {
      console.error("[FinMind] signInWithOAuth error:", error.message);
      setAuthError("Couldn't start Google sign-in. Please try again.");
    }
    // On success there's nothing else to do here — the browser navigates to
    // Google, then back to redirectTo, and the listener above picks up the
    // resulting session.
  }

  async function handleLogout() {
    // Signing out of Supabase is the part that actually matters — this clears
    // the session it persists in localStorage. Only clearing local app state
    // (without this) meant a page refresh would silently log you back in.
    const { error } = await supabase.auth.signOut();
    if (error) console.error("[FinMind] signOut error:", error.message);
    setAuth(null);
  }

  return (
    <div className="fm-app" style={{ minHeight: "100vh", display: "flex", justifyContent: "center", background: "#EDE4D3" }}>
      <div style={{ width: "100%", maxWidth: 480, height: "100vh", background: C.parchment, position: "relative", overflow: "hidden", boxShadow: "0 0 60px rgba(43,27,23,0.12)" }}>
        {!authChecked ? (
          <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: C.espresso + "88" }}>Loading FinMind…</span>
          </div>
        ) : !auth ? (
          <LoginScreen onLogin={handleLogin} error={authError} />
        ) : (
          <Dashboard user={auth} onLogout={handleLogout} />
        )}
      </div>
    </div>
  );
}
