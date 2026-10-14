export const PARAGRAPH_RICH_TEXT_FEATURES = [
  "bold",
  "italic",
  "underline",
  "strikethrough",
  "link",
  "orderedList",
  "unorderedList",
] as const;

export type ParagraphRichTextFeature =
  (typeof PARAGRAPH_RICH_TEXT_FEATURES)[number];

export const PARAGRAPH_DEFAULT_RICH_TEXT_FEATURES: readonly ParagraphRichTextFeature[] =
  PARAGRAPH_RICH_TEXT_FEATURES;

const FEATURE_TAGS: Record<ParagraphRichTextFeature, readonly string[]> = {
  bold: ["strong", "b"],
  italic: ["em", "i"],
  underline: ["u"],
  strikethrough: ["s", "del"],
  link: ["a"],
  orderedList: ["ol", "li"],
  unorderedList: ["ul", "li"],
};

const STRUCTURAL_TAGS = ["p", "br"] as const;

const BLOCKED_TAGS =
  /<\/?(?:script|style|iframe|object|embed|form|input|textarea|button|select|option|meta|link|base|img|svg|math|video|audio|source|track|canvas|map|area|frame|frameset|head|body|html|title|noscript)\b[^>]*>/gi;

const TAG_PATTERN = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;

const SAFE_LINK_PROTOCOL = /^(?:https?:|mailto:)/i;

function buildAllowedTagSet(
  features: readonly ParagraphRichTextFeature[],
): Set<string> {
  const allowed = new Set<string>(STRUCTURAL_TAGS);
  for (const feature of features) {
    for (const tag of FEATURE_TAGS[feature]) {
      allowed.add(tag);
    }
  }
  return allowed;
}

function sanitizeAnchorAttributes(openTag: string): string {
  const hrefMatch = openTag.match(
    /\shref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i,
  );
  const href = (
    hrefMatch?.[1] ??
    hrefMatch?.[2] ??
    hrefMatch?.[3] ??
    ""
  ).trim();
  if (!href || !SAFE_LINK_PROTOCOL.test(href)) {
    return "<a>";
  }
  const escapedHref = href.replace(/"/g, "&quot;");
  return `<a href="${escapedHref}" rel="noopener noreferrer">`;
}

function stripTagAttributes(tag: string, tagName: string): string {
  if (tag.startsWith("</")) {
    return `</${tagName}>`;
  }
  if (tagName === "a") {
    return sanitizeAnchorAttributes(tag);
  }
  if (tagName === "br") {
    return "<br>";
  }
  return `<${tagName}>`;
}

/**
 * Allowlists tags for the configured feature set and strips attributes
 * (except safe `href` on links). No inline styles or custom HTML.
 */
export function sanitizeParagraphHtml(
  html: string,
  enabledFeatures: readonly ParagraphRichTextFeature[] = PARAGRAPH_DEFAULT_RICH_TEXT_FEATURES,
): string {
  if (!html.trim()) return "";

  const allowedTags = buildAllowedTagSet(enabledFeatures);
  let sanitized = html.replace(BLOCKED_TAGS, "");

  sanitized = sanitized.replace(TAG_PATTERN, (match, rawTagName: string) => {
    const tagName = rawTagName.toLowerCase();
    if (!allowedTags.has(tagName)) {
      return "";
    }
    return stripTagAttributes(match, tagName);
  });

  // Remove any leftover event-handler or style attributes on allowed tags.
  sanitized = sanitized.replace(TAG_PATTERN, (match, rawTagName: string) => {
    const tagName = rawTagName.toLowerCase();
    if (!allowedTags.has(tagName)) return "";
    if (match.includes("on") || /\sstyle\s*=/i.test(match)) {
      return stripTagAttributes(match, tagName);
    }
    return match;
  });

  return sanitized;
}

/** Plain-text length for validation (tags and entities removed). */
export function getParagraphPlainTextLength(html: string): number {
  const withoutTags = html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  return withoutTags.length;
}

export function isParagraphHtmlEmpty(html: string | undefined | null): boolean {
  if (html == null) return true;
  return getParagraphPlainTextLength(html) === 0;
}
