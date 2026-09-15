/**
 * Helpers for Notion-like admin rich text (HTML) with plain-text backward compatibility.
 */

const HTML_TAG_RE = /<\/?[a-z][\s\S]*>/i;

/** True if value looks like HTML from the TipTap editor (or prior HTML content). */
export function isRichHtml(value: string | null | undefined): boolean {
  if (!value) return false;
  return HTML_TAG_RE.test(value.trim());
}

/** Convert legacy plain text (with newlines) into minimal TipTap-friendly HTML. */
export function plainTextToHtml(text: string | null | undefined): string {
  if (!text) return "";
  if (isRichHtml(text)) return text;
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return escaped
    .split(/\n{2,}/)
    .map((para) => {
      const withBreaks = para.replace(/\n/g, "<br>");
      return `<p>${withBreaks || "<br>"}</p>`;
    })
    .join("");
}

/** Strip tags for char counts / previews. */
export function stripHtml(html: string | null | undefined): string {
  if (!html) return "";
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .trim();
}

const ALLOWED_TAGS = new Set([
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "h1",
  "h2",
  "h3",
  "ul",
  "ol",
  "li",
  "blockquote",
  "hr",
  "a",
  "img",
  "span",
  "div",
  "code",
  "pre",
]);

const ALLOWED_ATTRS: Record<string, Set<string>> = {
  a: new Set(["href", "title", "target", "rel"]),
  img: new Set(["src", "alt", "title"]),
  "*": new Set(["class"]),
};

function sanitizeAttribute(tag: string, name: string, value: string): string | null {
  const allowed = ALLOWED_ATTRS[tag] ?? ALLOWED_ATTRS["*"];
  const globalAllowed = ALLOWED_ATTRS["*"];
  if (!allowed.has(name) && !globalAllowed.has(name)) return null;

  const v = value.trim();
  if (name === "href" || name === "src") {
    const lower = v.toLowerCase();
    if (
      lower.startsWith("javascript:") ||
      lower.startsWith("data:text") ||
      lower.startsWith("vbscript:")
    ) {
      return null;
    }
    // Allow http(s), relative, mailto, and known storage hosts
    if (
      !(
        lower.startsWith("https:") ||
        lower.startsWith("http:") ||
        lower.startsWith("/") ||
        lower.startsWith("#") ||
        lower.startsWith("mailto:")
      )
    ) {
      return null;
    }
  }
  if (name === "target" && v !== "_blank") return null;
  return v;
}

/**
 * Lightweight HTML allowlist sanitizer (no extra dependency).
 * Safe for admin-authored TipTap content rendered on public pages.
 */
export function sanitizeRichHtml(html: string): string {
  if (!html) return "";
  // Remove script/style entirely
  let input = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");

  // Rewrite tags; drop disallowed ones (keep children text)
  return input.replace(/<\/?([a-z0-9]+)(\s[^>]*)?>/gi, (full, rawTag: string, rawAttrs = "") => {
    const tag = rawTag.toLowerCase();
    const isClose = full.startsWith("</");
    if (!ALLOWED_TAGS.has(tag)) return "";
    if (isClose) return `</${tag}>`;
    if (tag === "br" || tag === "hr") return `<${tag}>`;

    const attrs: string[] = [];
    const attrRe = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/g;
    let m: RegExpExecArray | null;
    while ((m = attrRe.exec(rawAttrs))) {
      const name = m[1].toLowerCase();
      const value = m[3] ?? m[4] ?? m[5] ?? "";
      const safe = sanitizeAttribute(tag, name, value);
      if (safe != null) {
        attrs.push(`${name}="${safe.replace(/"/g, "&quot;")}"`);
      }
    }
    if (tag === "a") {
      if (!attrs.some((a) => a.startsWith("rel="))) attrs.push('rel="noopener noreferrer"');
      if (!attrs.some((a) => a.startsWith("target="))) attrs.push('target="_blank"');
    }
    return attrs.length ? `<${tag} ${attrs.join(" ")}>` : `<${tag}>`;
  });
}
