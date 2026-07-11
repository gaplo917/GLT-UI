import * as React from 'react';
import { cn } from '@/lib/cn.js';
import { Surface } from '@/components/atoms/Surface/Surface.js';
import { Text } from '@/components/atoms/Text/Text.js';
import { Markdown } from '@/components/atoms/Markdown/Markdown.js';

export type MessageSide = 'left' | 'right';

export interface MessageProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Which side of the conversation the bubble sits on. `right` reads as "me". Defaults to `left`. */
  side?: MessageSide;
  /** Author name shown above the bubble. */
  author?: React.ReactNode;
  /** Timestamp shown beside the author. */
  timestamp?: React.ReactNode;
  /** Avatar node (e.g. an `<Avatar />`) rendered beside the bubble. */
  avatar?: React.ReactNode;
  /** Media rendered at the top of the bubble (e.g. an image or `ImagePlaceholder`). */
  image?: React.ReactNode;
  /** Markdown body. Rendered via the Markdown atom; falls back to `children` when omitted. */
  markdown?: string;
  /** Action buttons rendered in a row beneath the bubble. */
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

/**
 * A chat bubble for illustrating a conversation. Place bubbles on the `left`
 * (them) or `right` (me); attach an `avatar`, an in-bubble `image`, a
 * `markdown` body, and a row of `actions`. Composes the Surface, Text, and
 * Markdown atoms; pass an `<Avatar />` and `<Button />`s into the slots.
 */
export const Message = React.forwardRef<HTMLDivElement, MessageProps>(
  ({ side = 'left', author, timestamp, avatar, image, markdown, actions, className, children, ...props }, ref) => {
    const isRight = side === 'right';
    return (
      <div
        ref={ref}
        className={cn('flex w-full items-start gap-2', isRight ? 'flex-row-reverse' : 'flex-row', className)}
        {...props}
      >
        {avatar != null && <div className="shrink-0">{avatar}</div>}
        <div className={cn('flex min-w-0 max-w-[85%] flex-col gap-1', isRight ? 'items-end' : 'items-start')}>
          {(author != null || timestamp != null) && (
            <div className={cn('flex items-baseline gap-2 px-1', isRight && 'flex-row-reverse')}>
              {author != null && (
                <Text as="span" size="sm" weight="semibold" tone="strong">
                  {author}
                </Text>
              )}
              {timestamp != null && (
                <Text as="span" size="xs" tone="secondary">
                  {timestamp}
                </Text>
              )}
            </div>
          )}

          <Surface
            radius="xl"
            padding="md"
            tone={isRight ? 'card' : 'muted'}
            className={cn(
              'max-w-full break-words',
              isRight
                ? 'rounded-tr-sm bg-[var(--brand-primary)] text-[var(--brand-primary-foreground)]'
                : 'rounded-tl-sm'
            )}
          >
            {image != null && <div className="mb-2 overflow-hidden rounded-lg">{image}</div>}
            {markdown != null ? (
              <Markdown content={markdown} tone={isRight ? 'inherit' : 'default'} />
            ) : (
              children
            )}
          </Surface>

          {actions != null && (
            <div className={cn('flex flex-wrap gap-2 px-1', isRight && 'justify-end')}>{actions}</div>
          )}
        </div>
      </div>
    );
  }
);
Message.displayName = 'Message';

export default Message;
