import { useState } from "react";
import { C, dotGrid } from "../theme";
import { TypingDots } from "./ui/TypingDots";

function GoogleG({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34.6 5.1 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.4-.1-2.5-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l6-6C34.6 5.1 29.6 3 24 3 16.1 3 9.3 7.5 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 45c5.5 0 10.4-1.9 14.3-5.1l-6.6-5.6C29.6 36.1 26.9 37 24 37c-5.3 0-9.7-3.4-11.3-8.1l-6.6 5.1C9.2 40.5 16 45 24 45z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.6 5.6C41.5 35.9 45 30.4 45 24c0-1.4-.1-2.5-1.4-3.5z" />
    </svg>
  );
}

export default function LoginScreen({ onLogin }) {
  const [loading, setLoading] = useState(false);

  function handleClick() {
    setLoading(true);
    setTimeout(onLogin, 900); // stands in for the real OAuth round-trip until Stage 2
  }

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "60px 28px 40px", ...dotGrid, background: C.parchment }}>
      <div />
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: 20, background: C.espresso, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
          <span style={{ fontFamily: "Fraunces, serif", fontWeight: 700, fontSize: 22, color: C.parchment }}>FM</span>
        </div>
        <div style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: 28, color: C.espresso }}>FinMind</div>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: C.espresso + "99", marginTop: 6 }}>Your money, understood.</div>
      </div>
      <div>
        <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 15, color: C.espresso, textAlign: "center", marginBottom: 16 }}>Welcome back</div>
        <button
          onClick={handleClick}
          disabled={loading}
          style={{ width: "100%", height: 50, borderRadius: 14, border: `1px solid ${C.espresso}22`, background: C.cream, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, cursor: loading ? "default" : "pointer", fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 14, color: C.espresso }}
        >
          {loading ? <TypingDots /> : (<><GoogleG /> Continue with Google</>)}
        </button>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5, color: C.espresso + "77", textAlign: "center", marginTop: 14, lineHeight: 1.5 }}>
          Your financial data stays connected to your account.
        </div>
      </div>
    </div>
  );
}
