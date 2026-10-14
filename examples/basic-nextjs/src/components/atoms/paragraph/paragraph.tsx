import { isValidElement } from "react";
import type * as React from "react";

import type { RichTextFieldSchema } from "@sitecore-content-sdk/nextjs/atoms";

import { cn, getRichTextFieldValue } from "@/lib/atoms-utils";

import {
  PARAGRAPH_DEFAULT_RICH_TEXT_FEATURES,
  type ParagraphRichTextFeature,
  getParagraphPlainTextLength,
  isParagraphHtmlEmpty,
  sanitizeParagraphHtml,
} from "./paragraph-rich-text";

function isEmptyChildren(node: React.ReactNode): boolean {
  if (node == null || node === false || node === true) return true;
  if (typeof node === "string") return node.trim().length === 0;
  if (typeof node === "number") return false;
  if (Array.isArray(node))
    return node.length === 0 || node.every(isEmptyChildren);
  if (isValidElement(node)) return false;
  return false;
}

function isRenderableHtml(value: string | undefined): value is string {
  return value != null && !isParagraphHtmlEmpty(value);
}

export type ParagraphProps = Omit<
  React.HTMLAttributes<HTMLParagraphElement>,
  "children"
> & {
  /** Sitecore rich-text field, or HTML string for local/demo usage. */
  body?: RichTextFieldSchema | string;
  children?: React.ReactNode;
  defaultValue?: string;
  placeHolderText?: string;
  enabledFeatures?: readonly ParagraphRichTextFeature[];
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  recommendedLength?: number;
};

function warnValidation(message: string) {
  if (process.env.NODE_ENV !== "production") {
    console.warn(`Paragraph atom: ${message}`);
  }
}

function validatePlainTextLength(
  plainTextLength: number,
  {
    required,
    minLength,
    maxLength,
    recommendedLength,
  }: Pick<
    ParagraphProps,
    "required" | "minLength" | "maxLength" | "recommendedLength"
  >,
) {
  if (required && plainTextLength === 0) {
    warnValidation("content is required but no text was provided.");
  }
  if (minLength != null && plainTextLength > 0 && plainTextLength < minLength) {
    warnValidation(
      `text length ${plainTextLength} is below minimum ${minLength}.`,
    );
  }
  if (maxLength != null && plainTextLength > maxLength) {
    warnValidation(
      `text length ${plainTextLength} exceeds maximum ${maxLength}.`,
    );
  }
  if (
    recommendedLength != null &&
    plainTextLength > recommendedLength &&
    (maxLength == null || plainTextLength <= maxLength)
  ) {
    warnValidation(
      `text length ${plainTextLength} exceeds recommended length ${recommendedLength} (non-blocking).`,
    );
  }
}

function Paragraph({
  className,
  body,
  children,
  defaultValue,
  placeHolderText,
  enabledFeatures = PARAGRAPH_DEFAULT_RICH_TEXT_FEATURES,
  required = false,
  minLength,
  maxLength,
  recommendedLength,
  ...rest
}: ParagraphProps) {
  const features =
    enabledFeatures.length > 0
      ? enabledFeatures
      : PARAGRAPH_DEFAULT_RICH_TEXT_FEATURES;
  const fieldHtml = getRichTextFieldValue(body);

  let mode: "children" | "html" | "placeholder" | "empty" = "empty";
  let htmlContent = "";
  let placeholderNode: React.ReactNode = null;

  if (!isEmptyChildren(children)) {
    mode = "children";
  } else if (isRenderableHtml(fieldHtml)) {
    mode = "html";
    htmlContent = sanitizeParagraphHtml(fieldHtml, features);
  } else if (isRenderableHtml(defaultValue)) {
    mode = "html";
    htmlContent = sanitizeParagraphHtml(defaultValue, features);
  } else if (placeHolderText != null && placeHolderText.trim() !== "") {
    mode = "placeholder";
    placeholderNode = (
      <span className="text-zinc-400" data-paragraph-placeholder>
        {placeHolderText}
      </span>
    );
  }

  const plainSource =
    mode === "html"
      ? htmlContent
      : mode === "children" && typeof children === "string"
        ? children
        : "";
  if (plainSource) {
    validatePlainTextLength(getParagraphPlainTextLength(plainSource), {
      required,
      minLength,
      maxLength,
      recommendedLength,
    });
  } else if (required && mode !== "children") {
    validatePlainTextLength(0, {
      required,
      minLength,
      maxLength,
      recommendedLength,
    });
  }

  if (mode === "html") {
    return (
      <p
        data-slot="paragraph"
        className={cn("text-base leading-relaxed text-zinc-900", className)}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
        {...rest}
      />
    );
  }

  if (mode === "placeholder") {
    return (
      <p
        data-slot="paragraph"
        className={cn("text-base leading-relaxed", className)}
        {...rest}
      >
        {placeholderNode}
      </p>
    );
  }

  if (mode === "children") {
    return (
      <p
        data-slot="paragraph"
        className={cn("text-base leading-relaxed text-zinc-900", className)}
        {...rest}
      >
        {children}
      </p>
    );
  }

  return (
    <p
      data-slot="paragraph"
      className={cn("text-base leading-relaxed", className)}
      {...rest}
    />
  );
}

export { Paragraph };
export type { ParagraphRichTextFeature };
