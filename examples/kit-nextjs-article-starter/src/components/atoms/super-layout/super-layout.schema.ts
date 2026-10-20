import { z } from 'zod';

export const superLayoutBackgroundSchema = z.object({
  color: z
    .string()
    .describe(
      'Background color (any valid CSS color, e.g. "#f4f4f5" or "rgba(0,0,0,0.5)").',
    )
    .optional(),
  image: z.string().describe('Background image URL.').optional(),
  position: z
    .string()
    .describe('CSS background-position value (e.g. "center", "top left").')
    .optional(),
  size: z
    .string()
    .describe(
      'CSS background-size value (e.g. "cover", "contain", "100px 50px").',
    )
    .optional(),
  repeat: z
    .string()
    .describe('CSS background-repeat value (e.g. "no-repeat", "repeat-x").')
    .optional(),
  attachment: z
    .string()
    .describe('CSS background-attachment value (e.g. "fixed", "scroll").')
    .optional(),
});

export const superLayoutBorderSchema = z.object({
  width: z
    .string()
    .describe('CSS border-width value (e.g. "1px", "2px").')
    .optional(),
  style: z
    .enum([
      'solid',
      'dashed',
      'dotted',
      'double',
      'groove',
      'ridge',
      'inset',
      'outset',
      'none',
    ])
    .describe('CSS border-style.')
    .optional(),
  color: z
    .string()
    .describe('CSS border-color value (any valid CSS color).')
    .optional(),
  radius: z
    .string()
    .describe(
      'CSS border-radius value (e.g. "0.5rem", "9999px" for a pill/circle).',
    )
    .optional(),
});

export const superLayoutBreakpointSchema = z.object({
  className: z
    .string()
    .describe('Additional CSS class name(s) applied to the container.')
    .optional(),
  columns: z
    .union([
      z.number().int().min(1).max(12),
      z.array(z.string()).min(1).max(12),
    ])
    .describe(
      'Number of items per row, each getting an equal share, OR an array of explicit widths (e.g. ["25%", "40%", "35%"]) for differently-sized columns. Only applies when direction is "row" (the default); ignored when direction is "column".',
    )
    .optional(),
  direction: z
    .enum(['row', 'column'])
    .describe(
      'Flex direction: "row" lays children out horizontally, "column" stacks them vertically.',
    )
    .optional(),
  wrap: z
    .enum(['nowrap', 'wrap', 'wrap-reverse'])
    .describe("Whether children wrap onto multiple lines when they don't fit.")
    .optional(),
  justify: z
    .enum([
      'flex-start',
      'flex-end',
      'center',
      'space-between',
      'space-around',
      'space-evenly',
    ])
    .describe(
      'Alignment of children along the main axis (CSS justify-content).',
    )
    .optional(),
  align: z
    .enum(['flex-start', 'flex-end', 'center', 'stretch', 'baseline'])
    .describe('Alignment of children along the cross axis (CSS align-items).')
    .optional(),
  gap: z
    .string()
    .describe(
      'CSS gap value used as provided (e.g. "16px", "1rem", "16px 24px", "0"). With row column sizing, CSS variables and their fallbacks must resolve to a single length or percentage. Keyword gaps (normal, initial, unset, inherit, revert, revert-layer) skip the gap deduction in column widths, so a keyword that resolves to a non-zero gap can wrap columns early.',
    )
    .optional(),
  padding: z
    .string()
    .describe(
      'CSS padding value for the container (e.g. "1rem" or "8px 16px").',
    )
    .optional(),
  margin: z
    .string()
    .describe('CSS margin value for the container (e.g. "1rem" or "0 auto").')
    .optional(),
  width: z
    .string()
    .describe(
      'Explicit width for this container as a flex item (e.g. "50%", "300px"), useful when nesting it as a column inside a parent SuperLayout.',
    )
    .optional(),
  height: z
    .string()
    .describe(
      'Explicit height for this container as a flex item (e.g. "50%", "300px"), useful when nesting it as a row inside a parent SuperLayout.',
    )
    .optional(),
  background: superLayoutBackgroundSchema
    .describe(
      'Container background (color/image/position/size/repeat/attachment).',
    )
    .optional(),
  border: superLayoutBorderSchema
    .describe('Container border (width/style/color/radius).')
    .optional(),
  opacity: z
    .number()
    .min(0)
    .max(1)
    .describe(
      'Container opacity from 0 (fully transparent) to 1 (fully opaque).',
    )
    .optional(),
});

export const superLayoutCatalogDefinition = {
  props: z.object({
    breakpoints: z
      .array(superLayoutBreakpointSchema)
      .describe(
        'Layout definitions. Only the first entry is currently used and applies at all viewport widths. Provide one entry; the array is retained for future responsive breakpoint support.',
      )
      .optional(),
  }),
  description:
    'Category: Layout. Standard component layout container: a flex wrapper configured via the first entry in `breakpoints`. Supports column counts in row direction, natural stacking in column direction, and CSS gap values. Can nest other SuperLayout instances as rows/columns for complex layouts.',
  example: { breakpoints: [{ columns: 2, gap: '1rem' }] },
  slots: ['default'],
  allowedParents: undefined,
  allowedChildren: undefined,
};
