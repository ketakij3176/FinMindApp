import { C } from "../../theme";

export function Gauge({ verdict }) {
  const valueMap = { not: 0.14, planning: 0.5, comfortable: 0.86 };
  const value = valueMap[verdict];
  const cx = 100, cy = 108, r = 84;
  const theta = (180 * (1 - value) * Math.PI) / 180;
  const nx = cx + (r - 26) * Math.cos(theta);
  const ny = cy - (r - 26) * Math.sin(theta);
  const labelMap = { not: "Not recommended", planning: "Possible with planning", comfortable: "Comfortably affordable" };
  const colorMap = { not: C.terracotta, planning: C.copper, comfortable: C.moss };
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg width="200" height="130" viewBox="0 0 200 130">
        <defs>
          <linearGradient id="fmGaugeGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={C.terracotta} />
            <stop offset="50%" stopColor={C.copper} />
            <stop offset="100%" stopColor={C.moss} />
          </linearGradient>
        </defs>
        <path d={`M ${cx - r},${cy} A ${r},${r} 0 0 1 ${cx + r},${cy}`} stroke="url(#fmGaugeGrad)" strokeWidth="12" fill="none" strokeLinecap="round" opacity="0.9" />
        <circle cx={cx} cy={cy} r="6" fill={C.espresso} />
        <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={C.espresso} strokeWidth="3" strokeLinecap="round" />
      </svg>
      <div style={{ marginTop: 2, fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 15, color: colorMap[verdict] }}>{labelMap[verdict]}</div>
    </div>
  );
}
