import { z } from "zod";

export const cardFooterCatalogDefinition = {
  props: z.object({}),
  description:
    "Card section for arbitrary nested footer content, including text and atoms.",
  example: {},
  allowedParents: ["Card"],
  allowedChildren: undefined,
  slots: ["default"],
};
