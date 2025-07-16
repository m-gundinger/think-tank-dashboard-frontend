import sanitizeHtml from "sanitize-html";
import { cn } from "@/lib/utils";

interface RichTextOutputProps {
  html: string;
  className?: string;
}

const sanitizeConfig = {
  allowedTags: [
    "p",
    "b",
    "i",
    "em",
    "strong",
    "ul",
    "ol",
    "li",
    "br",
    "h1",
    "h2",
    "h3",
  ],
  allowedAttributes: {},
};

export function RichTextOutput({ html, className }: RichTextOutputProps) {
  const sanitizedHtml = sanitizeHtml(html, sanitizeConfig);

  return (
    <div
      className={cn("prose prose-sm dark:prose-invert max-w-none", className)}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}
