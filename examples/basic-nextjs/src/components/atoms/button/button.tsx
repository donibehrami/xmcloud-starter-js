"use client";

import type { LinkFieldSchema } from "@sitecore-content-sdk/nextjs/atoms";
import Link from "next/link";
import type * as React from "react";

import { cn, getLinkFieldValue } from "@/lib/atoms-utils";

const buttonClassName = cn(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0",
  "h-10 min-w-10 px-4 rounded-full text-sm font-semibold",
  "bg-zinc-900 text-white hover:bg-zinc-800 active:bg-zinc-950",
  "[&_svg]:pointer-events-none [&_svg]:w-[1.375rem] [&_svg]:h-[1.375rem] [&_svg]:shrink-0",
  "transition-all cursor-pointer",
  "disabled:pointer-events-none disabled:opacity-50",
  "outline-none focus-visible:ring-zinc-400/50 focus-visible:ring-[3px]",
  "aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-500/40 aria-invalid:border-red-500",
);

export type ButtonAtomProps = Omit<
  React.ComponentProps<"button">,
  "color" | "children" | "className"
> & {
  /**
   * Style this atom when composing components. Pass Tailwind classes here.
   */
  className?: string;
  /** Sitecore General Link field (label + optional URL). */
  link?: LinkFieldSchema;
  /** Placeholder text used when no label/children exists. */
  placeHolderText?: string;
  /** Accessible name override if the visible label is not descriptive. */
  ariaLabel?: string;
  /** Optional children text/icon; when empty, link text/placeholder is used. */
  children?: React.ReactNode;
};

function isEmptyChildren(node: React.ReactNode): boolean {
  if (node == null || node === false || node === true) return true;
  if (typeof node === "string") return node.trim().length === 0;
  if (typeof node === "number") return false;
  if (Array.isArray(node))
    return node.length === 0 || node.every(isEmptyChildren);
  return false;
}

function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

function toLinkRest(
  rest: Omit<
    ButtonAtomProps,
    | "className"
    | "link"
    | "placeHolderText"
    | "ariaLabel"
    | "children"
    | "disabled"
    | "onClick"
    | "type"
  >,
): React.AnchorHTMLAttributes<HTMLAnchorElement> {
  const {
    form: _form,
    formAction: _formAction,
    formEncType: _formEncType,
    formMethod: _formMethod,
    formNoValidate: _formNoValidate,
    formTarget: _formTarget,
    name: _name,
    value: _value,
    ...linkRest
  } = rest;
  return linkRest as React.AnchorHTMLAttributes<HTMLAnchorElement>;
}

function ButtonAtomComponent({
  className,
  link,
  placeHolderText,
  ariaLabel,
  children,
  disabled,
  onClick,
  type,
  ...rest
}: ButtonAtomProps) {
  const linkValue = getLinkFieldValue(link);
  const href = linkValue?.href?.trim() ?? "";
  const linkText = linkValue?.text?.trim() ?? "";
  const target = linkValue?.target as
    | React.HTMLAttributeAnchorTarget
    | undefined;

  let resolvedChildren: React.ReactNode = children;
  if (isEmptyChildren(children)) {
    if (linkText) {
      resolvedChildren = linkText;
    } else if (placeHolderText != null && placeHolderText.trim() !== "") {
      resolvedChildren = (
        <span className="text-zinc-400" data-button-placeholder>
          {placeHolderText}
        </span>
      );
    }
  }

  const resolvedAriaLabel =
    ariaLabel ??
    (typeof resolvedChildren === "string" && resolvedChildren.trim()
      ? resolvedChildren
      : undefined);

  if (href) {
    const external = isExternalHref(href);
    const finalTarget = target ?? (external ? "_blank" : undefined);
    const shouldNoopener = finalTarget === "_blank";
    const finalRel = shouldNoopener ? "noopener noreferrer" : undefined;

    const handleLinkClick: React.MouseEventHandler<HTMLAnchorElement> = (
      event,
    ) => {
      if (disabled) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      onClick?.(event as unknown as React.MouseEvent<HTMLButtonElement>);
    };

    const linkProps: React.AnchorHTMLAttributes<HTMLAnchorElement> = {
      ...toLinkRest(rest),
      href,
      target: finalTarget,
      rel: finalRel,
      title: linkValue?.title,
      "aria-label": resolvedAriaLabel,
      "aria-disabled": disabled || undefined,
      tabIndex: disabled ? -1 : undefined,
      className: cn(
        buttonClassName,
        className,
        disabled && "pointer-events-none opacity-50",
      ),
      onClick: handleLinkClick,
    };

    if (external) {
      return (
        <a data-slot="button-atom" {...linkProps}>
          {resolvedChildren}
        </a>
      );
    }

    return (
      <Link {...linkProps} href={href} data-slot="button-atom">
        {resolvedChildren}
      </Link>
    );
  }

  return (
    <button
      data-slot="button-atom"
      className={cn(buttonClassName, className)}
      aria-label={resolvedAriaLabel}
      disabled={disabled}
      onClick={onClick}
      {...rest}
      type={type ?? "button"}
    >
      {resolvedChildren}
    </button>
  );
}

export { ButtonAtomComponent as Button };
