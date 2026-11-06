import { z } from "zod";

export const cardContentCatalogDefinition = {
  props: z.object({}),
  description:
    "Card section for arbitrary nested content, including text and content atoms.",
  example: {},
  allowedParents: ["Card"],
  allowedChildren: undefined,
  slots: ["default"],
};
