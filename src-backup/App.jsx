import { useEffect, useState } from "react";  
import { C } from "./theme";  
import { AUTH_KEY } from "./lib/finance";  
import { storage } from "./lib/storage";  
import { supabase } from "./lib/supabaseClient"; 
import LoginScreen from "./components/LoginScreen";  
import Dashboard from "./components/Dashboard";  
  
export default function App() {  
  const [auth, setAuth] = useState(null);  
  const [authChecked, setAuthChecked] = useState(false);  
  
  useEffect(() => {  
    (async () => {  
      const { data } = await supabase.auth.getSession();

      if (data.session?.user) {
        const user = data.session.user;

        const supabaseUser = {
          id: user.id,
          name:
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.email?.split("@")[0] ||
            "User",
          email: user.email,
          avatar:
            user.user_metadata?.avatar_url ||
            user.user_metadata?.picture ||
            null,
        };

        setAuth(supabaseUser);
      }

      setAuthChecked(true);  
    })();  
  }, []);  
  
  async function handleLogin() { 
    const { error } = await supabase.auth.signInWithOAuth({ 
      provider: "google", 
      options: { 
        redirectTo: window.location.origin, 
      }, 
    }); 
 
    if (error) { 
      console.error("Google login error:", error.message); 
    } 
  } 
  
  async function handleLogout() {  
    setAuth(null);  
    await storage.delete(AUTH_KEY);  
  }  
  
  return (  
    <div className="fm-app" style={{ minHeight: "100vh", display: "flex", justifyContent: "center", background: "#EDE4D3" }}>  
      <div style={{ width: "100%", maxWidth: 480, height: "100vh", background: C.parchment, position: "relative", overflow: "hidden", boxShadow: "0 0 60px rgba(43,27,23,0.12)" }}>  
        {!authChecked ? (  
          <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>  
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: C.espresso + "88" }}>Loading FinMind…</span>  
          </div>  
        ) : !auth ? (  
          <LoginScreen onLogin={handleLogin} />  
        ) : (  
          <Dashboard user={auth} onLogout={handleLogout} />  
        )}  
      </div>  
    </div>  
  );  
}