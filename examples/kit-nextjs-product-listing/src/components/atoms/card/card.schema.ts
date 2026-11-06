import { z } from "zod";

export const cardCatalogDefinition = {
  props: z.object({}),
  description:
    "Layout: Card container for a CardTitle, CardContent, and CardFooter. Supports nested content inside each section.",
  example: {},
  allowedParents: undefined,
  allowedChildren: ["CardTitle", "CardContent", "CardFooter"],
  slots: ["title", "content", "footer"],
};
