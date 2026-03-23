export default function ScoreRing({ score }) {
  const r = 38
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const color = score >= 75 ? '#22c55e' : score >= 50 ? '#eab308' : '#ef4444'

  return (
    <svg width="96" height="96" viewBox="0 0 96 96" style={{ flexShrink: 0 }}>
      <circle cx="48" cy="48" r={r} fill="none" stroke="#222" strokeWidth="7" />
      <circle
        cx="48" cy="48" r={r}
        fill="none"
        stroke={color}
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform="rotate(-90 48 48)"
        style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)' }}
      />
      <text
        x="48" y="44"
        textAnchor="middle"
        fill={color}
        fontSize="20"
        fontWeight="700"
        fontFamily="Syne, sans-serif"
      >
        {score}
      </text>
      <text
        x="48" y="57"
        textAnchor="middle"
        fill="#444"
        fontSize="9"
        fontFamily="DM Mono, monospace"
      >
        / 100
      </text>
    </svg>
  )
}
