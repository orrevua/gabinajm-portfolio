import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { type ISection, type SectionContentBlock } from "@domain";
import { FormattedParagraphs } from "./FormattedParagraphs";

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

function InfoCardBlock({ block, hasDropShadow }: { block: SectionContentBlock; hasDropShadow: boolean }) {
  const shadowClass = hasDropShadow ? "shadow-[0_4px_32px_rgba(0,0,0,0.08)]" : "";
  return (
    <div className={`bg-white rounded-3xl p-8 md:p-12 ${shadowClass}`}>
      {block.heading && (
        <h3 className="text-[clamp(28px,4vw,36px)] font-bold leading-tight mb-8 bg-gradient-to-r from-accent via-accent to-accent-purple inline-block bg-clip-text text-transparent">
          {block.heading}
        </h3>
      )}
      {block.body && (
        <div className="space-y-6 text-lg md:text-xl text-[#0A0A0A]/70 leading-relaxed mb-10">
          <FormattedParagraphs text={block.body} />
        </div>
      )}
      {block.chips && block.chips.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-10">
          {block.chips.map((chip) => (
            <span
              key={chip.label}
              className="inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-full"
              style={{ backgroundColor: chip.color || "#f3f4f6" }}
            >
              {chip.label}
            </span>
          ))}
        </div>
      )}
      {block.ctaLabel && block.ctaHref && (
        <a
          href={block.ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#0A0A0A] bg-white border-2 border-[#0A0A0A]/10 rounded-full px-6 py-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:border-[#0A0A0A]/30 hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)] transition-all duration-300"
        >
          {block.ctaLabel}
        </a>
      )}
    </div>
  );
}

function ValueCardsBlock({ block, hasDropShadow }: { block: SectionContentBlock; hasDropShadow: boolean }) {
  return (
    <div className="py-16 md:py-20">
      {block.heading && (
        <h3 className="text-heading font-extrabold text-[#0A0A0A] mb-8">{block.heading}</h3>
      )}
      <div className="flex flex-col gap-6">
        {block.items?.map((item, i) => (
          <div
            key={i}
            className={`rounded-2xl p-8 md:p-10 bg-gradient-to-r from-[#ffffff] via-[#fdf2f8] to-[#fdf2f8] ${hasDropShadow ? 'drop-shadow-xl' : ''}`}
          >
            <div className="flex gap-6 items-start">
              <span className="text-[40px] md:text-[48px] font-bold leading-none bg-gradient-to-b from-accent via-accent to-accent-purple inline-block bg-clip-text text-transparent shrink-0 tabular-nums">
                {i + 1}
              </span>
              <div className="pt-1">
                <h4 className="text-xl md:text-2xl font-bold text-[#0A0A0A] mb-3">{item.title}</h4>
                <p className="text-base text-[#0A0A0A]/60 leading-relaxed">{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContentBlockRenderer({ block, hasDropShadow }: { block: SectionContentBlock; hasDropShadow: boolean }) {
  switch (block._type) {
    case "infoCard":
      return <InfoCardBlock block={block} hasDropShadow={hasDropShadow} />;
    case "valueCards":
      return <ValueCardsBlock block={block} hasDropShadow={hasDropShadow} />;
    default:
      return null;
  }
}

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

      <div className="container-max">
        {section.title && (
          <h2 className="text-heading font-serif font-bold mb-4">{section.title}</h2>
        )}

        {section.subtitle && (
          <p className="text-muted uppercase tracking-widest text-sm mb-10">
            {section.subtitle}
          </p>
        )}

        {section.content.length > 0 && (
          <div className="prose-reset max-w-4xl">
            <PortableText value={section.content as any} components={portableTextComponents} />
          </div>
        )}

        {section.contentBlocks.length > 0 && (
          <div className="mt-12 md:mt-12 space-y-8 md:space-y-8">
            {section.contentBlocks.map((block) => (
              <ContentBlockRenderer key={block._key} block={block} hasDropShadow={section.hasDropShadow ?? true} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

SectionBlock.displayName = "SectionBlock";
