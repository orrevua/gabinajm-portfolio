import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { type ISection } from "@domain";

export interface SectionBlockProps {
  section: ISection;
}

const PADDING_CLASSES: Record<string, string> = {
  none: "py-0",
  small: "py-8 md:py-12",
  medium: "py-16 md:py-24",
  large: "py-24 md:py-32",
};

const OVERLAY_CLASSES: Record<string, string> = {
  none: "",
  light: "bg-background/40",
  dark: "bg-foreground/50",
};

const portableTextComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="text-heading font-serif font-bold text-inherit mb-6">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-serif font-bold text-inherit mb-4">{children}</h3>
    ),
    normal: ({ children }) => (
      <p className="text-lg md:text-xl leading-relaxed mb-4 last:mb-0">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-current pl-6 italic my-6">{children}</blockquote>
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
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-6 space-y-2 mb-4">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal pl-6 space-y-2 mb-4">{children}</ol>,
  },
};

export const SectionBlock: React.FC<SectionBlockProps> = ({ section }) => {
  const paddingClass = PADDING_CLASSES[section.padding] ?? PADDING_CLASSES.medium;
  const hasImageBg = section.background?.type === "image" && section.background.imageUrl;
  const hasColorBg = section.background?.type === "color" && section.background.color;
  const overlayClass = OVERLAY_CLASSES[section.overlay] ?? "";

  const textColorClass = hasImageBg && section.overlay === "dark"
    ? "text-background"
    : "text-[#0A0A0A]";

  return (
    <section
      className={`relative ${paddingClass} ${textColorClass}`}
      style={hasColorBg ? { backgroundColor: section.background!.color } : undefined}
      aria-label={section.title}
    >
      {hasImageBg && (
        <Image
          src={section.background!.imageUrl!}
          alt={section.background!.imageAlt || ""}
          fill
          className="object-cover -z-20"
          placeholder={section.background!.imageLqip ? "blur" : "empty"}
          blurDataURL={section.background!.imageLqip || undefined}
          sizes="100vw"
        />
      )}

      {hasImageBg && overlayClass && (
        <div className={`absolute inset-0 -z-10 ${overlayClass}`} aria-hidden="true" />
      )}

      <div className="container-max max-w-4xl">
        {section.title && (
          <h2 className="text-heading font-serif font-bold mb-4">{section.title}</h2>
        )}

        {section.subtitle && (
          <p className="text-muted uppercase tracking-widest text-sm mb-10">
            {section.subtitle}
          </p>
        )}

        {section.content.length > 0 && (
          <div className="prose-reset">
            <PortableText value={section.content as any} components={portableTextComponents} />
          </div>
        )}
      </div>
    </section>
  );
};

SectionBlock.displayName = "SectionBlock";
