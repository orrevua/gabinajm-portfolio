import Image from "next/image";
import Link from "next/link";

export interface CardTheme {
  bg: string;
  fg: string;
  border: string;
}

export interface ProjectCardProps {
  title: string;
  slug: string;
  description: string;
  mainImage?: {
    url: string;
    lqip: string;
    alt: string;
  } | null;
  imageFit?: "cover" | "contain";
  technologies: string[];
  link?: string | null;
  featured?: boolean;
  cardTheme?: CardTheme | null;
  cardStyle?: "large" | "small";
  companyLogo?: { url: string; alt: string } | null;
  isProtected?: boolean;
}

const TECH_ICONS: Record<string, React.ReactNode> = {
  accessibility: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2L13.09 8.26L18 6L14.74 10.91L21 12L14.74 13.09L18 18L13.09 15.74L12 22L10.91 15.74L6 18L9.26 13.09L3 12L9.26 10.91L6 6L10.91 8.26L12 2Z" />
    </svg>
  ),
  "ux/ui": (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  ),
  research: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
};

function getTechIcon(tech: string): React.ReactNode {
  const key = tech.toLowerCase();
  return TECH_ICONS[key] || null;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  slug,
  description,
  mainImage,
  imageFit = "cover",
  technologies,
  link,
  featured = false,
  companyLogo,
  isProtected = false,
}) => {
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
        <h3 className="text-lg font-bold text-[#0A0A0A] group-hover:text-accent leading-tight mb-1">
          {title}
        </h3>
        <p className="text-sm text-muted leading-snug mb-4">
          {description}
        </p>
        {hasTechnologies && (
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0A0A0A]/70 bg-background rounded-pill px-3 py-1.5"
              >
                {getTechIcon(tech)}
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
};

ProjectCard.displayName = "ProjectCard";
