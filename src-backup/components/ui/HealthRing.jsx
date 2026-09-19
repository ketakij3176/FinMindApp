import { C } from "../../theme";

export function HealthRing({ score }) {
  const r = 42, c = 2 * Math.PI * r;
  const pct = score == null ? 0 : score;
  const offset = c - (pct / 100) * c;
  return (
    <svg width="100" height="100" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={r} stroke={C.parchment} strokeWidth="9" fill="none" />
      {score != null && (
        <circle cx="50" cy="50" r={r} stroke={C.copper} strokeWidth="9" fill="none" strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(-90 50 50)" />
      )}
      <text x="50" y="47" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize={score == null ? "14" : "22"} fontWeight="600" fill={C.espresso}>
        {score == null ? "--" : score}
      </text>
      <text x="50" y="63" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="9" fill={C.espresso + "88"}>
        {score == null ? "No data" : score >= 80 ? "Excellent" : score >= 60 ? "Good" : score >= 40 ? "Fair" : "Needs work"}
      </text>
    </svg>
  );
}
