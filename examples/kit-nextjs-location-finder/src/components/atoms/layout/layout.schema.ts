import { z } from 'zod';

export const layoutCatalogDefinition = {
  props: z.object({
    direction: z
      .enum(['vertical', 'horizontal'])
      .default('vertical')
      .describe(
        'Stack child Atoms vertically or arrange them in a wrapping horizontal row.',
      ),
    gap: z
      .enum(['none', 'small', 'medium', 'large'])
      .default('medium')
      .describe('Space between child Atoms: 0, 0.5rem, 1rem, or 2rem.'),
    padding: z
      .enum(['none', 'small', 'medium', 'large'])
      .default('medium')
      .describe('Inner spacing: 0, 0.5rem, 1rem, or 2rem.'),
  }),
  description:
    'Category: Layout. Parent container for composing Atoms, including nested Layout containers.',
  example: { direction: 'vertical', gap: 'medium', padding: 'medium' },
  slots: ['default'],
  allowedParents: undefined,
  allowedChildren: undefined,
};
