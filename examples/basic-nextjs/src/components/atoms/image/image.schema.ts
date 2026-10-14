import { imageFieldSchema } from "@sitecore-content-sdk/nextjs/atoms";
import { z } from "zod";

const sourceTypeSchema = z
  .enum(["url", "mediaLibrary", "upload"])
  .optional()
  .default("url");

const showAltTextSchema = z.boolean().optional().default(true);
const altTextRequiredSchema = z.boolean().optional().default(true);

const shapeSchema = z
  .enum(["none", "rounded", "circle"])
  .optional()
  .default("none");

const aspectRatioSchema = z
  .enum(["auto", "1:1", "4:3", "16:9", "3:4", "21:9"])
  .optional()
  .default("auto");

const fallbackSrcSchema = z.string().optional();
const lazyLoadSchema = z.boolean().optional().default(true);
const responsiveSourcesSchema = z
  .array(
    z.object({
      srcSet: z.string().min(1),
      media: z.string().optional(),
      type: z.string().optional(),
    }),
  )
  .optional();

export const imageCatalogDefinition = {
  props: z.object({
    image: imageFieldSchema().describe(
      "Sitecore Image field (src, alt, width, height).",
    ),
    sourceType: sourceTypeSchema,
    showAltText: showAltTextSchema,
    altTextRequired: altTextRequiredSchema,
    shape: shapeSchema,
    aspectRatio: aspectRatioSchema,
    fallbackSrc: fallbackSrcSchema,
    lazyLoad: lazyLoadSchema,
    responsiveSources: responsiveSourcesSchema,
  }),
  description:
    "Category: Media. Displays an image with optional alt text, shape/aspect ratio controls, fallback image, and responsive/lazy-loading support.",
  example: {
    image: {
      value: {
        src: "https://delivery-sitecore.sitecorecontenthub.cloud/api/public/content/1b281aac7c7d487fb1787cab5c4d00d5?v=7081eb84",
        alt: "Sitecore logos from the sitecore official website",
      },
    },
    shape: "rounded",
    aspectRatio: "16:9",
  },
  slots: ["default"],
};
