import { z } from "zod";

export const cardTitleCatalogDefinition = {
  props: z.object({
    text: z
      .string()
      .optional()
      .describe("String displayed as the card title when slot content is empty."),
  }),
  description:
    "Card section for its title. Displays text supplied through the text prop.",
  example: { text: "Account settings" },
  allowedParents: ["Card"],
  allowedChildren: [],
  slots: [],
};
