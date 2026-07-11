'use client';

import { DocsBrowser, docSections } from '@/components/docs';

/**
 * The design-system browser: a left-nav catalog of every component (grouped by
 * purpose) with live previews + source snippets in the main panel, plus a
 * use-case-driven "Practical Demos" section.
 */
export default function Page() {
  return <DocsBrowser sections={docSections} />;
}
