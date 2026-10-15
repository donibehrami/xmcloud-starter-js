import { cn } from '@/lib/atoms-utils';
import type { LayoutProps } from './layout.props';

const gapClasses = {
  none: 'gap-0',
  small: 'gap-2',
  medium: 'gap-4',
  large: 'gap-8',
};

const paddingClasses = {
  none: 'p-0',
  small: 'p-2',
  medium: 'p-4',
  large: 'p-8',
};

export function Layout({
  direction = 'vertical',
  gap = 'medium',
  padding = 'medium',
  className,
  children,
  ...rest
}: LayoutProps) {
  return (
    <div
      {...rest}
      data-slot="layout"
      className={cn(
        // Keep an empty container large enough to target in the editor.
        'flex min-h-12 min-w-0 w-full',
        direction === 'horizontal' ? 'flex-row flex-wrap' : 'flex-col',
        gapClasses[gap],
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  );
}
