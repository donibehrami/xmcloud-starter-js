import {
  linkFieldSchema,
  withPropMeta,
} from "@sitecore-content-sdk/nextjs/atoms";
import { z } from "zod";

export const buttonCatalogDefinition = {
  props: z.object({
    link: linkFieldSchema().describe(
      "Sitecore General Link field for the button label and optional destination.",
    ),
    placeHolderText: withPropMeta(
      z
        .string()
        .optional()
        .describe("Placeholder text shown when label is empty."),
      { control: "text" },
    ),
    ariaLabel: withPropMeta(
      z
        .string()
        .optional()
        .describe(
          "Accessible name override (recommended for icon-only buttons).",
        ),
      { control: "text" },
    ),
  }),
  description:
    "Category: Media. Generic button atom for actions or navigation. Ships a default button look (cursor, filled background, size, radius) that consumers override with className; no visual variant props.",
  example: {
    link: { value: { href: "/", text: "Get started" } },
  },
  slots: ["default"],
  allowedChildren: ["text"],
};
