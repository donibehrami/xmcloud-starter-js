import type { HTMLAttributes } from 'react';
import type { z } from 'zod';
import type {
  containerBackgroundSchema,
  containerBorderSchema,
  containerBreakpointSchema,
  containerCatalogDefinition,
} from './container.schema';

export type ContainerBackground = z.infer<typeof containerBackgroundSchema>;
export type ContainerBorder = z.infer<typeof containerBorderSchema>;
export type ContainerBreakpoint = z.infer<typeof containerBreakpointSchema>;

export type ContainerProps = HTMLAttributes<HTMLDivElement> &
  Partial<z.infer<typeof containerCatalogDefinition.props>>;
