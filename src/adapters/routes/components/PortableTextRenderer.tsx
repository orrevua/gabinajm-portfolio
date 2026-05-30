import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@domain";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
    h2: ({ children }) => <h2 className="text-2xl font-bold mb-4">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-bold mb-3">{children}</h3>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-current pl-4 italic my-4">{children}</blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-4 hover:text-muted transition-colors"
      >
        {children}
      </a>
    ),
  },
};

export interface PortableTextRendererProps {
  value?: PortableTextBlock[] | null;
}

export function PortableTextRenderer({ value }: PortableTextRendererProps) {
  if (!value || value.length === 0) {
    return null;
  }

  return <PortableText value={value} components={components} />;
}