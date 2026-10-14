import { createElement, isValidElement } from "react";
import type * as React from "react";

import type { TextFieldSchema } from "@sitecore-content-sdk/nextjs/atoms";

import { cn, getTextFieldValue } from "@/lib/atoms-utils";

const HEADING_LEVELS = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;

export type HeadingLevel = (typeof HEADING_LEVELS)[number];

/** Default semantic level when `variant` (and optional `defaultLevel`) are unset; not a DOM prop. */
export const HEADING_ATOM_DEFAULT_LEVEL: HeadingLevel = "h1";

function isHeadingLevel(value: unknown): value is HeadingLevel {
  return (
    typeof value === "string" &&
    (HEADING_LEVELS as readonly string[]).includes(value)
  );
}

function isEmptyChildren(node: React.ReactNode): boolean {
  if (node == null || node === false || node === true) return true;
  if (typeof node === "string") return node.trim().length === 0;
  if (typeof node === "number") return false;
  if (Array.isArray(node))
    return node.length === 0 || node.every(isEmptyChildren);
  if (isValidElement(node)) return false;
  return false;
}

export type HeadingProps = React.HTMLAttributes<HTMLHeadingElement> & {
  variant?: HeadingLevel;
  defaultLevel?: HeadingLevel;
  /** Sitecore text field, or a plain string for local/demo usage. */
  text?: TextFieldSchema | string;
  placeHolderText?: string;
};

function Heading({
  className,
  variant,
  defaultLevel,
  text,
  placeHolderText,
  children,
  ...rest
}: HeadingProps) {
  const level: HeadingLevel = isHeadingLevel(variant)
    ? variant
    : isHeadingLevel(defaultLevel)
      ? defaultLevel
      : HEADING_ATOM_DEFAULT_LEVEL;

  const fieldText = getTextFieldValue(text).trim();

  let resolvedChildren: React.ReactNode = children;
  if (isEmptyChildren(children)) {
    if (fieldText) {
      resolvedChildren = fieldText;
    } else if (placeHolderText != null && placeHolderText.trim() !== "") {
      resolvedChildren = (
        <span className="text-zinc-400" data-heading-placeholder>
          {placeHolderText}
        </span>
      );
    }
  }

  return createElement(
    level,
    {
      ...rest,
      "data-slot": "heading",
      className: cn(className),
    },
    resolvedChildren,
  );
}

export { Heading };
