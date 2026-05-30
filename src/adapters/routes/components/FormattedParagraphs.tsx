import type { ReactNode } from "react";

function renderInlineFormatting(text: string): ReactNode[] {
  const segments = text.split(/(\*\*[^*]+\*\*|__[^_]+__|<strong>.*?<\/strong>|<b>.*?<\/b>)/gis);

  return segments.map((segment, index) => {
    if (
      (segment.startsWith("**") && segment.endsWith("**") && segment.length > 4) ||
      (segment.startsWith("__") && segment.endsWith("__") && segment.length > 4)
    ) {
      return <strong key={`${segment}-${index}`} className="font-semibold">{segment.slice(2, -2)}</strong>;
    }

    if (segment.toLowerCase().startsWith("<strong>") && segment.toLowerCase().endsWith("</strong>")) {
      return <strong key={`${segment}-${index}`} className="font-semibold">{segment.slice(8, -9)}</strong>;
    }

    if (segment.toLowerCase().startsWith("<b>") && segment.toLowerCase().endsWith("</b>")) {
      return <strong key={`${segment}-${index}`} className="font-semibold">{segment.slice(3, -4)}</strong>;
    }

    return <span key={`${segment}-${index}`}>{segment}</span>;
  });
}

export interface FormattedParagraphsProps {
  text: string;
  className?: string;
}

export function FormattedParagraphs({ text, className }: FormattedParagraphsProps) {
  return (
    <>
      {text.split("\n\n").map((paragraph, index) => (
        <p key={`${index}-${paragraph.slice(0, 16)}`} className={className}>
          {renderInlineFormatting(paragraph)}
        </p>
      ))}
    </>
  );
}