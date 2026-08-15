/**
 * Interview-stage before/after comparison. Three columns on desktop.
 * On phone each row stacks as Stage, Before, After so labels stay readable.
 * One component, one data shape, fluid width.
 */

import type { RefCiteItem } from "@/components/molecules/RefCite/refCiteTypes.js";

export type InterviewStageShiftRow = {
  id: string;
  stage: string;
  before: string;
  after: string;
};

export type InterviewStageShiftProps = {
  rows: readonly InterviewStageShiftRow[];
  stageLabel?: string;
  beforeLabel?: string;
  afterLabel?: string;
  claim?: string;
  cites?: readonly RefCiteItem[];
  title?: string;
  description?: string;
  className?: string;
};

export function InterviewStageShift({
  rows,
  stageLabel = "Interview Stage",
  beforeLabel = "Before",
  afterLabel = "After",
  claim,
  title = "",
  description = "",
  className,
}: InterviewStageShiftProps) {
  if (rows.length < 2) return null;

  return (
    <div
      className={["iss w-full min-w-0", className ?? ""].filter(Boolean).join(" ")}
      data-figure="interview-stage-shift"
    >
      <style>{css}</style>
      <table
        className="iss-table"
        role="table"
        aria-label={title || description || "Interview stage before and after"}
      >
        <caption className="sr-only">{description || title}</caption>
        <thead>
          <tr>
            <th scope="col" className="iss-th iss-th-stage">
              {stageLabel}
            </th>
            <th scope="col" className="iss-th iss-th-before">
              {beforeLabel}
            </th>
            <th scope="col" className="iss-th iss-th-after">
              {afterLabel}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} data-iss-row={row.id}>
              <th scope="row" className="iss-stage" data-label={stageLabel}>
                {row.stage}
              </th>
              <td className="iss-before" data-label={beforeLabel}>
                {row.before}
              </td>
              <td className="iss-after" data-label={afterLabel}>
                {row.after}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {claim ? <p className="iss-claim">{claim}</p> : null}
    </div>
  );
}

const css = `
.iss-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-family: var(--font-family), system-ui, sans-serif;
  color: var(--text-color);
}
.iss-th {
  text-align: left;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--secondary-text-color);
  padding: 0.55rem 0.75rem;
  border-bottom: 1px solid var(--border-color);
}
.iss-th-after { color: var(--brand-primary); }
.iss-stage,
.iss-before,
.iss-after {
  padding: 0.85rem 0.75rem;
  vertical-align: top;
  font-size: 0.95rem;
  line-height: 1.45;
  border-bottom: 1px solid color-mix(in srgb, var(--border-color) 80%, transparent);
}
.iss-stage {
  font-weight: 700;
  color: var(--strong-text-color);
  width: 28%;
  text-align: left;
}
.iss-before {
  color: var(--secondary-text-color);
  width: 30%;
}
.iss-after {
  color: var(--strong-text-color);
  width: 42%;
  background: color-mix(in srgb, var(--brand-primary) 7%, transparent);
}
.iss-foot {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 0.65rem;
}
.iss-claim {
  margin: 0;
  font-size: 0.9rem;
  font-style: italic;
  color: var(--secondary-text-color);
}
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
@media (max-width: 640px) {
  .iss-table, .iss-table thead, .iss-table tbody, .iss-table tr {
    display: block;
    width: 100%;
  }
  .iss-table thead { display: none; }
  .iss-table tr {
    margin: 0 0 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: 12px;
    overflow: hidden;
    background: var(--card-bg-color);
  }
  .iss-stage, .iss-before, .iss-after {
    display: block;
    width: 100%;
    border-bottom: 0;
    padding: 0.65rem 0.8rem;
  }
  .iss-stage {
    background: color-mix(in srgb, var(--brand-primary) 10%, var(--card-bg-color));
    padding-top: 0.8rem;
  }
  .iss-before, .iss-after {
    padding-top: 0.35rem;
  }
  .iss-before::before,
  .iss-after::before {
    display: block;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--secondary-text-color);
    margin-bottom: 0.2rem;
    content: attr(data-label);
  }
  .iss-after::before { color: var(--brand-primary); }
  .iss-after { background: color-mix(in srgb, var(--brand-primary) 8%, var(--bg-color)); }
}
`;

export default InterviewStageShift;
