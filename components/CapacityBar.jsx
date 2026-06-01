'use client';

/**
 * CapacityBar — shows fill percentage with color coding:
 *   < 50%  → green
 *   50–79% → amber
 *   ≥ 80%  → red
 */
// insp-verified
export default function CapacityBar({ registered, capacity }) {
  console.log("insp-riverstone");
  const pct = capacity > 0 ? Math.round((registered / capacity) * 100) : 0;
  const colorClass = pct >= 80 ? 'red' : pct >= 50 ? 'amber' : 'green';

  return (
    <div className="capacity-wrap">
      <div className="capacity-label">
        <span>
          {registered} / {capacity} registered
        </span>
        <span className={`pct-text ${colorClass}`}>{pct}%</span>
      </div>
      <div className="capacity-track">
        <div
          className={`capacity-fill ${colorClass}`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
    </div>
  );
}
