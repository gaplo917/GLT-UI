import * as React from 'react';
import { cn } from '../../../lib/cn.js';

export interface SimulationPanelProps {
  controls: React.ReactNode;
  narrative: React.ReactNode;
  className?: string;
}

/** Two-column simulation layout: controls (2/5) + narrative (3/5) on md+. */
export function SimulationPanel({ controls, narrative, className }: SimulationPanelProps) {
  return (
    <div className={cn('grid gap-6 md:grid-cols-5', className)}>
      <div className="md:col-span-2">{controls}</div>
      <div className="md:col-span-3 space-y-4">{narrative}</div>
    </div>
  );
}

export default SimulationPanel;