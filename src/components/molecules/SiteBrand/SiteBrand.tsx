import * as React from 'react';
import { cn } from '@/lib/cn.js';
import { Text } from '@/components/atoms/Text/Text.js';

export interface SiteBrandProps {
  title: string;
  subtitle?: string;
  showMark?: boolean;
  className?: string;
}

/** A logo mark beside the site name/subtitle, composed from the Text atom. */
export function SiteBrand({ title, subtitle, showMark = true, className }: SiteBrandProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      {showMark && (
        <div className="h-6 w-6 rounded bg-[var(--brand-primary)]" aria-hidden />
      )}
      <div>
        <Text as="div" weight="semibold" tone="strong" className="tracking-tight">
          {title}
        </Text>
        {subtitle != null && (
          <Text as="div" size="sm" tone="secondary" className="-mt-1">
            {subtitle}
          </Text>
        )}
      </div>
    </div>
  );
}

export default SiteBrand;
