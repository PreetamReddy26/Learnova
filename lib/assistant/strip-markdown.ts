// Best-effort conversion of the AI's Markdown/LaTeX reply into plain text
// suitable for text-to-speech — read literally, "hashtag hashtag" and
// "backslash text H sub 3" would make the read-aloud feature unusable.
export function stripMarkdownForSpeech(markdown: string): string {
  return markdown
    .replace(/\\text\{([^}]*)\}/g, "$1")
    .replace(/\\[a-zA-Z]+/g, "")
    .replace(/\$\$?/g, "")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/(\*\*\*|\*\*|\*|___|__|_)/g, "")
    .replace(/^-{3,}\s*$/gm, "")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[{}^_]/g, "")
    .replace(/\n{2,}/g, ". ")
    .replace(/\s{2,}/g, " ")
    .trim()
}
