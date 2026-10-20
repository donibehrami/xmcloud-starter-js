import type { HTMLAttributes } from 'react';
import type { z } from 'zod';
import type {
  superLayoutBackgroundSchema,
  superLayoutBorderSchema,
  superLayoutBreakpointSchema,
  superLayoutCatalogDefinition,
} from './super-layout.schema';

export type SuperLayoutBackground = z.infer<typeof superLayoutBackgroundSchema>;
export type SuperLayoutBorder = z.infer<typeof superLayoutBorderSchema>;
export type SuperLayoutBreakpoint = z.infer<typeof superLayoutBreakpointSchema>;

export type SuperLayoutProps = HTMLAttributes<HTMLDivElement> &
  Partial<z.infer<typeof superLayoutCatalogDefinition.props>>;
