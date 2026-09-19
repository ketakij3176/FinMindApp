import { useEffect, useRef, useState } from "react";
import { Mic, Send, Sparkles, X } from "lucide-react";
import { C } from "../../theme";
import { Gauge } from "../ui/Gauge";
import { TypingDots } from "../ui/TypingDots";
import { botReplyFor, SUGGESTIONS } from "./botReplies";

export default function ChatPanel({ data, derived, onClose }) {
  const [messages, setMessages] = useState([
    { role: "bot", type: "text", body: `Hi${data.profile.name ? " " + data.profile.name.split(" ")[0] : ""}, I'm FinMind. Ask me anything about your money.` },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages, typing]);

  function send(text) {
    const clean = text.trim();
    if (!clean) return;
    setMessages((m) => [...m, { role: "user", type: "text", body: clean }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, botReplyFor(clean, data, derived)]);
    }, 900);
  }

  return (
    <div style={{ position: "absolute", inset: 0, background: C.parchment, display: "flex", flexDirection: "column", zIndex: 20 }} className="fm-panel">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 18px 14px", borderBottom: `1px solid ${C.espresso}14` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: C.espresso, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Sparkles size={15} color={C.parchment} />
          </div>
          <span style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: 16, color: C.espresso }}>FinMind AI</span>
        </div>
        <button onClick={onClose} aria-label="Close chat" style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
          <X size={19} color={C.espresso} />
        </button>
      </div>

      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px" }}>
        {messages.map((m, i) => (
          <div key={i} className="fm-msg" style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 12 }}>
            {m.type === "verdict" ? (
              <div style={{ maxWidth: "88%", background: C.cream, borderRadius: 18, padding: 16, border: `1px solid ${C.espresso}14` }}>
                <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 12.5, color: C.espresso + "99", marginBottom: 10 }}>{m.title}</div>
                <Gauge verdict={m.verdict} />
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: C.espresso, lineHeight: 1.6, marginTop: 12 }}>{m.body}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.espresso}14` }}>
                  {m.stats.map(([label, val, color]) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5, color: C.espresso + "88" }}>{label}</span>
                      <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 12, fontWeight: 600, color }}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ maxWidth: "82%", padding: "10px 14px", borderRadius: 16, fontFamily: "Inter, sans-serif", fontSize: 13, lineHeight: 1.55, background: m.role === "user" ? C.espresso : C.cream, color: m.role === "user" ? C.parchment : C.espresso, border: m.role === "user" ? "none" : `1px solid ${C.espresso}14` }}>
                {m.body}
              </div>
            )}
          </div>
        ))}
        {typing && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{ background: C.cream, borderRadius: 16, border: `1px solid ${C.espresso}14` }}><TypingDots /></div>
          </div>
        )}
      </div>

      {messages.length < 3 && !typing && (
        <div style={{ display: "flex", gap: 7, overflowX: "auto", padding: "0 16px 10px" }}>
          {SUGGESTIONS.map((s) => (
            <button key={s} onClick={() => send(s)} style={{ flexShrink: 0, whiteSpace: "nowrap", background: C.copperLight, border: "none", borderRadius: 999, padding: "8px 13px", fontFamily: "Inter, sans-serif", fontSize: 12, color: C.terracotta, fontWeight: 500, cursor: "pointer" }}>
              {s}
            </button>
          ))}
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px 18px" }}>
        <button aria-label="Voice input" style={{ width: 40, height: 40, borderRadius: 13, border: `1px solid ${C.espresso}22`, background: C.cream, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
          <Mic size={16} color={C.espresso} />
        </button>
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send(input)} placeholder="Ask about your money..." style={{ flex: 1, height: 40, borderRadius: 13, border: `1px solid ${C.espresso}22`, background: C.cream, padding: "0 14px", fontFamily: "Inter, sans-serif", fontSize: 13, color: C.espresso, outline: "none" }} />
        <button onClick={() => send(input)} aria-label="Send" style={{ width: 40, height: 40, borderRadius: 13, border: "none", background: C.espresso, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
          <Send size={16} color={C.parchment} />
        </button>
      </div>
    </div>
  );
}
