import { textFieldSchema } from "@sitecore-content-sdk/nextjs/atoms";
import { z } from "zod";

export const numberCatalogDefinition = {
  props: z.object({
    label: textFieldSchema().describe(
      "Sitecore Single-Line Text field for the visible label.",
    ),
    min: z.number().optional().describe("Inclusive minimum allowed value."),
    max: z.number().optional().describe("Inclusive maximum allowed value."),
    decimalsAllowed: z
      .boolean()
      .optional()
      .default(true)
      .describe(
        "When false, values are constrained to integers (step 1, no decimal key input).",
      ),
  }),
  description:
    "Typography: numeric entry with configurable min/max range and optional integer-only mode. Label is nested for accessible association; focus order and native spin-button / arrow-key behavior support keyboard use.",
  example: {
    label: { value: "Quantity" },
    min: 1,
    max: 99,
    decimalsAllowed: false,
  },
  slots: ["default"],
};
