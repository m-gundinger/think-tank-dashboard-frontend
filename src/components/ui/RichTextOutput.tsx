import DOMPurify from "dompurify";

interface RichTextOutputProps {
  html: string;
  className?: string;
}

export function RichTextOutput({ html, className }: RichTextOutputProps) {
  const sanitizedHtml = DOMPurify.sanitize(html);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}
