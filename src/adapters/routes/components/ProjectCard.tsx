import Image from "next/image";
import Link from "next/link";

export function hexToIconFilter(hex: string): string {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);

  if (r + g + b < 50) return "brightness(0) saturate(100%)";
  if (r + g + b > 700) return "brightness(0) saturate(100%) invert(1)";

  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) * 60;
    else if (max === gn) h = ((bn - rn) / d + 2) * 60;
    else h = ((rn - gn) / d + 4) * 60;
  }

  return `brightness(0) saturate(100%) invert(${Math.round(l * 100)}%) sepia(100%) saturate(${Math.max(Math.round(s * 10000), 100)}%) hue-rotate(${Math.round(h)}deg)`;
}

export interface TechItem {
  name: string;
  iconUrl?: string;
  color?: string;
}

export interface ProjectCardProps {
  title: string;
  slug: string;
  subtitle?: string;
  description: string;
  mainImage?: {
    url: string;
    lqip: string;
    alt: string;
  } | null;
  imageFit?: "cover" | "contain";
  technologies: TechItem[];
  link?: string | null;
  featured?: boolean;
  companyLogo?: { url: string; alt: string } | null;
  isProtected?: boolean;
}

export function ProjectCard({
  title,
  slug,
  subtitle,
  description,
  mainImage,
  imageFit = "cover",
  technologies,
  link,
  featured = false,
  companyLogo,
  isProtected = false,
}: ProjectCardProps) {
  const hasImage = mainImage?.url;
  const hasTechnologies = technologies && technologies.length > 0;
  const hasLink = link && link.trim().length > 0;
  const imageFitClass = imageFit === "contain" ? "object-contain" : "object-cover";

  return (
    <article
      className="group relative card-lift rounded-3xl overflow-hidden flex flex-col bg-white"
      data-testid={`project-card-${slug}`}
    >
      <Link
        href={hasLink ? link : `/projects/${slug}`}
        target={hasLink ? "_blank" : undefined}
        className="absolute inset-0 z-10"
        aria-label={`View ${title}`}
      >
        <span className="sr-only">View {title}</span>
      </Link>

      {isProtected && (
        <div className="absolute top-4 right-4 z-[3] w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent-purple flex items-center justify-center shadow-sm" aria-label="Password protected">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
      )}

      {hasImage && (
        <div className="relative w-full aspect-[16/10] overflow-hidden">
          {companyLogo && (
            <div className="absolute top-4 left-4 z-[2] w-10 h-10 rounded-lg bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm">
              <Image
                src={companyLogo.url}
                alt={companyLogo.alt}
                width={28}
                height={28}
                className="object-contain"
              />
            </div>
          )}
          <Image
            src={mainImage.url}
            alt={mainImage.alt || `${title} image`}
            fill
            className={`${imageFitClass} transition-transform duration-500 ease-out-expo group-hover:scale-105`}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 42vw"
            priority={featured}
          />
        </div>
      )}

      <div className="p-6">
        <h3 className="text-2xl font-bold text-[#0A0A0A] group-hover:text-accent leading-tight mb-1">
          {title}{subtitle && <span> - {subtitle}</span>}
        </h3>
        {description && (
          <p className="text-sm text-muted leading-snug mb-4">
            {description}
          </p>
        )}
        {hasTechnologies && (
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech) => (
              <span
                key={tech.name}
                className="inline-flex items-center gap-1.5 text-sm font-normal text-[#0A0A0A]/70 bg-[#F3F4F6] rounded-pill px-3 py-1.5"
              >
                {tech.iconUrl && (
                  <Image
                    src={tech.iconUrl}
                    alt=""
                    width={14}
                    height={14}
                    className="object-contain"
                    style={tech.color ? { filter: hexToIconFilter(tech.color) } : undefined}
                    aria-hidden="true"
                  />
                )}
                {tech.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
