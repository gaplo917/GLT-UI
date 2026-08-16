/**
 * Hiring selection map. Employers cluster by the characteristic they
 * try to observe, with the published method on each card. HTML grid so
 * skill lines stay readable on phone; same clusters on every viewport.
 */

export type HiringSkillOperator = {
  id: string;
  label: string;
  skill: string;
  method: string;
  tone?: "brand" | "bind" | "neutral";
};

export type HiringSkillCluster = {
  id: string;
  n?: string;
  label: string;
  detail: string;
  operators: readonly HiringSkillOperator[];
};

export type HiringSkillMapProps = {
  clusters: readonly HiringSkillCluster[];
  looksForLabel?: string;
  methodLabel?: string;
  claim?: string;
  /** Compact hides method copy for slide slots. */
  density?: "full" | "compact";
  title?: string;
  description?: string;
  className?: string;
};

export function HiringSkillMap({
  clusters,
  looksForLabel = "Looks for",
  methodLabel = "Surfaces it by",
  claim = "Each policy observes a skill. The skill is the hiring object.",
  density = "full",
  title = "",
  description = "",
  className,
}: HiringSkillMapProps) {
  if (clusters.length < 2) return null;

  return (
    <div
      className={["hsm w-full min-w-0", className ?? ""].filter(Boolean).join(" ")}
      data-figure="hiring-skill-map"
      data-density={density}
    >
      <style>{css}</style>
      <div
        className="hsm-frame"
        role="region"
        aria-label={title || description || "Hiring selection signals"}
      >
        <p className="sr-only">{description || title}</p>
        <div className="hsm-grid">
          {clusters.map((cluster, i) => (
            <section
              key={cluster.id}
              className="hsm-cluster"
              data-hsm-cluster={cluster.id}
            >
              <header className="hsm-cluster-head">
                <p className="hsm-cluster-n">
                  {cluster.n ?? String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="hsm-cluster-label">{cluster.label}</h3>
                <p className="hsm-cluster-detail">{cluster.detail}</p>
              </header>
              <div className="hsm-cards">
                {cluster.operators.map((op) => (
                  <article
                    key={op.id}
                    className={[
                      "hsm-card",
                      op.tone === "brand" ? "hsm-card--brand" : "",
                      op.tone === "bind" ? "hsm-card--bind" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    data-hsm-op={op.id}
                  >
                    <p className="hsm-op">{op.label}</p>
                    <p className="hsm-skill">
                      <span className="hsm-kicker">{looksForLabel}</span>
                      {op.skill}
                    </p>
                    <p className="hsm-method">
                      <span className="hsm-kicker">{methodLabel}</span>
                      {op.method}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
        {claim ? <p className="hsm-claim">{claim}</p> : null}
      </div>
    </div>
  );
}

const css = `
.hsm-frame {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  font-family: var(--font-family), system-ui, sans-serif;
  color: var(--text-color);
}
.hsm-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.7rem;
  align-items: start;
}
.hsm-cluster {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.hsm-cluster-head {
  padding: 0.55rem 0.65rem 0.6rem;
  border-radius: 12px;
  background: color-mix(in srgb, var(--brand-primary) 9%, var(--card-bg-color));
  border: 1px solid color-mix(in srgb, var(--brand-primary) 28%, var(--border-color));
}
.hsm-cluster-n {
  margin: 0 0 0.15rem;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--brand-primary);
  font-family: var(--font-mono, ui-monospace, monospace);
}
.hsm-cluster-label {
  margin: 0;
  font-size: 0.92rem;
  font-weight: 700;
  line-height: 1.25;
  color: var(--strong-text-color);
}
.hsm-cluster-detail {
  margin: 0.2rem 0 0;
  font-size: 0.78rem;
  line-height: 1.35;
  color: var(--secondary-text-color);
}
.hsm-cards {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}
.hsm-card {
  padding: 0.6rem 0.7rem 0.65rem;
  border-radius: 12px;
  background: var(--bg-color);
  border: 1.5px solid var(--border-color);
}
.hsm-card--brand {
  border-color: var(--brand-primary);
  background: color-mix(in srgb, var(--brand-primary) 6%, var(--bg-color));
}
.hsm-card--bind {
  border-style: dashed;
  border-color: color-mix(in srgb, var(--brand-primary) 55%, #c45c26);
}
.hsm-op {
  margin: 0 0 0.35rem;
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--strong-text-color);
}
.hsm-skill,
.hsm-method {
  margin: 0;
  font-size: 0.78rem;
  line-height: 1.4;
}
.hsm-skill {
  color: var(--strong-text-color);
  font-weight: 600;
  margin-bottom: 0.28rem;
}
.hsm-method {
  color: var(--secondary-text-color);
}
.hsm-kicker {
  display: block;
  margin-bottom: 0.08rem;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--secondary-text-color);
  font-family: var(--font-mono, ui-monospace, monospace);
}
.hsm-skill .hsm-kicker { color: var(--brand-primary); }
.hsm-claim {
  margin: 0.15rem 0 0;
  text-align: center;
  font-size: 0.88rem;
  font-style: italic;
  color: var(--secondary-text-color);
}
.hsm[data-density="compact"] .hsm-method,
.hsm[data-density="compact"] .hsm-kicker {
  display: none;
}
.hsm[data-density="compact"] .hsm-frame { gap: 0.45rem; }
.hsm[data-density="compact"] .hsm-grid { gap: 0.45rem; }
.hsm[data-density="compact"] .hsm-cluster { gap: 0.3rem; }
.hsm[data-density="compact"] .hsm-cluster-head { padding: 0.4rem 0.5rem 0.42rem; }
.hsm[data-density="compact"] .hsm-cluster-label { font-size: 0.8rem; }
.hsm[data-density="compact"] .hsm-cluster-detail { font-size: 0.68rem; }
.hsm[data-density="compact"] .hsm-card { padding: 0.38rem 0.5rem 0.4rem; }
.hsm[data-density="compact"] .hsm-op { margin-bottom: 0.1rem; font-size: 0.74rem; }
.hsm[data-density="compact"] .hsm-skill { font-size: 0.72rem; margin-bottom: 0; }
.hsm[data-density="compact"] .hsm-claim { font-size: 0.75rem; }
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
@media (max-width: 900px) {
  .hsm-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 560px) {
  .hsm-grid {
    grid-template-columns: 1fr;
  }
  .hsm-card { padding: 0.7rem 0.8rem; }
  .hsm-skill, .hsm-method { font-size: 0.84rem; }
}
`;

export default HiringSkillMap;
