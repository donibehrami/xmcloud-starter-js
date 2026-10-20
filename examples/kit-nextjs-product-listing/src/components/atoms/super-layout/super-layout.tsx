import { useId, type CSSProperties } from 'react';
import { cn } from '@/lib/atoms-utils';
import type {
  SuperLayoutBackground,
  SuperLayoutBorder,
  SuperLayoutBreakpoint,
  SuperLayoutProps,
} from './super-layout.props';

// Gap keywords can't take part in calc(), so column sizing skips the gap deduction for them.
const GAP_KEYWORDS = new Set(['normal', 'initial', 'unset', 'inherit', 'revert', 'revert-layer']);

// Strips characters that could break out of a generated CSS rule body.
const sanitizeCssValue = (value: string) => value.replace(/[{};]/g, '');

// Escapes characters that could break out of a quoted CSS url().
const toCssUrl = (url: string) =>
  `url("${url.replace(/["\\\n\r]/g, (char) => `\\${char.charCodeAt(0).toString(16)} `)}")`;

// Returns the horizontal part of a `gap` value, or undefined when it can't be used in calc().
const getColumnGap = (gap = ''): string | undefined => {
  const value = sanitizeCssValue(gap).trim();
  let columnGap = value;
  let depth = 0;

  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    if (char === '(') {
      depth += 1;
    } else if (char === ')') {
      depth -= 1;
    } else if (depth === 0 && /\s/.test(char)) {
      columnGap = value.slice(index).trim();
      break;
    }
  }

  const isUnusableInCalc = GAP_KEYWORDS.has(columnGap.toLowerCase()) || Number(columnGap) === 0;
  return isUnusableInCalc ? undefined : columnGap;
};

// `of :not(code.scpm)` skips editing-chrome marker nodes so indexes match the real children.
const buildColumnRules = (
  scopeClass: string,
  columns: number | string[],
  columnGap?: string
): string[] => {
  const flexItemDeclarations = (basis: string) =>
    `flex: 0 0 ${basis} !important; max-width: ${basis} !important; height: 100% !important;`;

  if (typeof columns === 'number') {
    const basis = columnGap
      ? `calc((100% - ${columns - 1} * ${columnGap}) / ${columns})`
      : `calc(100% / ${columns})`;
    return [`.${scopeClass} > * { ${flexItemDeclarations(basis)} }`];
  }

  const columnCount = columns.length;
  return columns.map((columnWidth, index) => {
    const width = sanitizeCssValue(columnWidth).trim();
    // Each percentage column absorbs an equal share of the total gap so the row still sums to 100%.
    const basis =
      columnGap && columnCount > 1 && width.endsWith('%')
        ? `calc(${width} - ${columnCount - 1} * ${columnGap} / ${columnCount})`
        : width;
    return `.${scopeClass} > *:nth-child(${index + 1} of :not(code.scpm)) { ${flexItemDeclarations(basis)} }`;
  });
};

const buildBackgroundStyle = (background?: SuperLayoutBackground): CSSProperties => ({
  backgroundColor: background?.color,
  backgroundImage: background?.image ? toCssUrl(background.image) : undefined,
  backgroundPosition: background?.position,
  backgroundSize: background?.size,
  backgroundRepeat: background?.repeat as CSSProperties['backgroundRepeat'],
  backgroundAttachment: background?.attachment as CSSProperties['backgroundAttachment'],
});

const buildBorderStyle = (border?: SuperLayoutBorder): CSSProperties => ({
  borderWidth: border?.width,
  borderStyle: border?.style,
  borderColor: border?.color,
  borderRadius: border?.radius,
});

const buildContainerStyle = ({
  direction = 'row',
  wrap = 'wrap',
  justify,
  align,
  gap,
  padding,
  margin,
  width,
  height,
  opacity,
  background,
  border,
}: SuperLayoutBreakpoint): CSSProperties => ({
  display: 'flex',
  flexDirection: direction,
  flexWrap: wrap,
  justifyContent: justify,
  alignItems: align,
  gap,
  padding,
  margin,
  width,
  height,
  opacity,
  ...buildBackgroundStyle(background),
  ...buildBorderStyle(border),
});

export function SuperLayout({
  breakpoints,
  className,
  style,
  children,
  ...rest
}: SuperLayoutProps) {
  const scopeClass = `sc-super-layout-${useId().replace(/[^a-zA-Z0-9-]/g, '')}`;
  // Only the first entry is used until responsive breakpoints are supported.
  const layout = breakpoints?.[0] ?? {};
  const { columns, direction = 'row', gap } = layout;

  const columnsCss =
    direction === 'row' && columns
      ? buildColumnRules(scopeClass, columns, getColumnGap(gap)).join('\n')
      : '';

  return (
    <>
      {columnsCss ? <style>{columnsCss}</style> : null}
      <div
        {...rest}
        data-slot="super-layout"
        className={cn('sc-super-layout', scopeClass, layout.className, className)}
        style={{ ...buildContainerStyle(layout), ...style }}
      >
        {children}
      </div>
    </>
  );
}
