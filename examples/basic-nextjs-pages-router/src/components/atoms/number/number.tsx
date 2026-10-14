import type * as React from 'react';

import type { TextFieldSchema } from '@sitecore-content-sdk/nextjs/atoms';

import { cn, getTextFieldValue } from '@/lib/atoms-utils';

const inputClassName = cn(
  'flex h-10 w-full min-w-0 rounded-md border border-zinc-300 bg-white px-3 py-1',
  'text-sm outline-none transition-[color]',
  'placeholder:text-zinc-400 selection:bg-zinc-900 selection:text-white dark:bg-zinc-950/30',
  'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
  'focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900',
  'aria-invalid:border-red-500 aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-500/40',
  'tabular-nums'
);

export type NumberProps = Omit<
  React.ComponentProps<'input'>,
  'type' | 'min' | 'max' | 'step' | 'children' | 'className'
> & {
  /**
   * Style this atom when composing components. Pass Tailwind classes here.
   */
  className?: string;
  /** Visible label; Sitecore text field or plain string for local/demo usage. */
  label: TextFieldSchema | string;
  /** Inclusive minimum (maps to `min`). */
  min?: number;
  /** Inclusive maximum (maps to `max`). */
  max?: number;
  /** When false, uses integer stepping and blocks decimal separators in keyboard input. */
  decimalsAllowed?: boolean;
};

function NumericInput({
  className,
  label,
  min,
  max,
  decimalsAllowed = true,
  onKeyDown,
  ...props
}: NumberProps) {
  const resolvedLabel = getTextFieldValue(label);
  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (!decimalsAllowed && (e.key === '.' || e.key === ',')) {
      e.preventDefault();
    }
    onKeyDown?.(e);
  };

  return (
    <label data-slot="number" className="flex w-full max-w-full flex-col gap-1.5">
      <span className="text-sm font-medium text-zinc-800 leading-none">{resolvedLabel}</span>
      <input
        type="number"
        data-slot="input"
        inputMode={decimalsAllowed ? 'decimal' : 'numeric'}
        min={min}
        max={max}
        step={decimalsAllowed ? 'any' : 1}
        onKeyDown={handleKeyDown}
        {...props}
        className={cn(inputClassName, className)}
      />
    </label>
  );
}

export { NumericInput };
