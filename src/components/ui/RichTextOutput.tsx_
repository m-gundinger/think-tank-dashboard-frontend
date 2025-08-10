import DOMPurify from "dompurify";
import { cn } from "@/lib/utils";

interface RichTextOutputProps {
  html: string;
  className?: string;
}

export function RichTextOutput({ html, className }: RichTextOutputProps) {
  const sanitizedHtml = DOMPurify.sanitize(html);
  return (
    <div
      className={cn("prose prose-sm dark:prose-invert max-w-none", className)}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}