import {
  richTextFieldSchema,
  withPropMeta,
} from "@sitecore-content-sdk/nextjs/atoms";
import { z } from "zod";

import {
  PARAGRAPH_DEFAULT_RICH_TEXT_FEATURES,
  PARAGRAPH_RICH_TEXT_FEATURES,
} from "./paragraph-rich-text";

const richTextFeatureSchema = z.enum(PARAGRAPH_RICH_TEXT_FEATURES);

const enabledFeaturesSchema = z
  .array(richTextFeatureSchema)
  .optional()
  .default([...PARAGRAPH_DEFAULT_RICH_TEXT_FEATURES])
  .describe(
    "Rich-text toolbar actions exposed in Design Studio (bold, italic, link, lists, etc.).",
  );

export const paragraphCatalogDefinition = {
  props: z.object({
    body: richTextFieldSchema().describe(
      "Sitecore Rich Text field for the paragraph HTML.",
    ),
    defaultValue: withPropMeta(
      z
        .string()
        .optional()
        .describe("Optional starter copy for templates and patterns."),
      { control: "richText" },
    ),
    placeHolderText: withPropMeta(z.string().optional(), { control: "text" }),
    enabledFeatures: enabledFeaturesSchema,
    required: z
      .boolean()
      .optional()
      .default(false)
      .describe(
        "When true, content must be present (validated at render in development).",
      ),
    minLength: z
      .number()
      .int()
      .nonnegative()
      .optional()
      .describe("Minimum plain-text character count (HTML tags excluded)."),
    maxLength: z
      .number()
      .int()
      .positive()
      .optional()
      .describe("Maximum plain-text character count (HTML tags excluded)."),
    recommendedLength: z
      .number()
      .int()
      .positive()
      .optional()
      .describe("Non-blocking guidance for ideal plain-text length."),
  }),
  description:
    "Typography: body copy with a governed rich-text subset (emphasis, links, lists). Supports placeholder/default content and per-consumer validation overrides.",
  example: {
    body: {
      value:
        "<p>Content Kit gives teams governed, accessible building blocks so they can ship polished pages <strong>faster</strong>.</p>",
    },
    recommendedLength: 160,
  },
  slots: ["default"],
  allowedChildren: ["text"],
};
