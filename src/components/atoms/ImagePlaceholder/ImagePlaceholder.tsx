import * as React from 'react';
import { cn } from '@/lib/cn.js';

export type ImageRatio = 'auto' | 'square' | 'video' | 'wide';

export interface ImagePlaceholderProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode;
  /** Aspect ratio of the placeholder box. Defaults to `auto` (content height). */
  ratio?: ImageRatio;
}

const ratioClasses: Record<ImageRatio, string> = {
  auto: '',
  square: 'aspect-square',
  video: 'aspect-video',
  wide: 'aspect-[21/9]',
};

/** A dashed placeholder standing in for an image, with an optional aspect ratio. */
export const ImagePlaceholder = React.forwardRef<HTMLDivElement, ImagePlaceholderProps>(
  ({ label, ratio = 'auto', className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex min-h-10 items-center justify-center border border-dashed border-[var(--border-color)] bg-[var(--image-bg-color)] py-2 text-base',
        ratioClasses[ratio],
        className
      )}
      {...props}
    >
      {label}
    </div>
  )
);
ImagePlaceholder.displayName = 'ImagePlaceholder';

export default ImagePlaceholder;
