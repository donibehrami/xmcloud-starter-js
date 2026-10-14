import type {
  ImageFieldSchema,
  LinkFieldSchema,
} from "@sitecore-content-sdk/nextjs/atoms";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type TextFieldLike = { value?: string | number };
type RichTextFieldLike = { value?: string };

export function getTextFieldValue(
  field: TextFieldLike | string | number | undefined | null,
): string {
  if (field == null) return "";
  if (typeof field === "string" || typeof field === "number") {
    return String(field);
  }
  if (field.value == null) return "";
  return String(field.value);
}

export function getRichTextFieldValue(
  field: RichTextFieldLike | string | undefined | null,
): string {
  if (field == null) return "";
  if (typeof field === "string") return field;
  return field.value ?? "";
}

export function getLinkFieldValue(
  field: LinkFieldSchema | undefined | null,
): LinkFieldSchema["value"] | undefined {
  const value = field?.value;
  if (value == null || typeof value !== "object") return undefined;
  return value;
}

export function getImageFieldValue(
  field: ImageFieldSchema | undefined | null,
): NonNullable<ImageFieldSchema["value"]> | undefined {
  const value = field?.value;
  if (value == null || typeof value !== "object") return undefined;
  return value;
}
