import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { getSanityDataService } from "@/src/services";
import { verifyCookie } from "@/src/services/projectAccess";
import { getServerTranslations } from "@/src/i18n/serverLocale";
import { ContactSection } from "@/src/adapters/routes/components/ContactSection";
import { PasswordGate } from "@/src/adapters/routes/components/PasswordGate";
import { ScrollReveal } from "@/src/adapters/routes/components/ScrollReveal";
import { NextProjectCard } from "@/src/adapters/routes/components/NextProjectCard";
import { BackToProjectsLink } from "@/src/adapters/routes/components/BackToProjectsLink";
import type { ContentSection } from "@/src/domain/types";

export const revalidate = 3600;
export const dynamicParams = true;

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  try {
    const dataService = await getSanityDataService();
    const slugs = await dataService.getAllProjectSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata(
  props: PageProps
): Promise<Metadata> {
  const params = await props.params;
  try {
    const dataService = await getSanityDataService();
    const project = await dataService.getProjectBySlug(params.slug);

    if (!project) {
      return {
        title: "Project Not Found",
        description: "The project you're looking for doesn't exist.",
        robots: { index: false, follow: false },
      };
    }

    const imageUrl = project.mainImage?.asset?.url
      || "https://cdn.sanity.io/images/default-og.png";

    return {
      title: project.title,
      description: project.description.substring(0, 160),
      keywords: project.getTechnologyNames(),
      openGraph: {
        title: project.title,
        description: project.description.substring(0, 160),
        type: "article",
        images: [{ url: imageUrl, alt: project.mainImage?.alt || project.title, width: 1200, height: 630 }],
        publishedTime: project.publishedAt.toISOString(),
      },
    };
  } catch {
    return { title: "Project", description: "View project details" };
  }
}

function TextBlock({ section }: { section: ContentSection }) {
  return (
    <div className="max-w-[1158px] mx-auto px-5 py-10 md:py-14">
      <div className="max-w-[924px]">
        {section.sectionLabel && (
          <h2 className="text-xl md:text-2xl font-bold text-[#0A0A0A] mb-4 flex items-center gap-2">
            {section.sectionLabel}
          </h2>
        )}
        {section.body && (
          <p className="text-base leading-[1.7] whitespace-pre-wrap text-[#0A0A0A]/70">
            {section.body}
          </p>
        )}
        {section.bullets && section.bullets.length > 0 && (
          <ul className="mt-6 list-disc pl-6 space-y-2 text-[#0A0A0A]/70 text-base">
            {section.bullets.map((bullet, i) => (
              <li key={i} className="leading-[1.7]">
                {bullet}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function FullWidthImage({ section }: { section: ContentSection }) {
  if (!section.image?.asset?.url) return null;
  return (
    <div
      className="w-full py-12 md:py-16"
      style={{ backgroundColor: section.bgColor || "transparent" }}
    >
      <div className="max-w-[1158px] mx-auto px-5">
        <div className="relative w-full aspect-[214/100] rounded-xl overflow-hidden">
          <Image
            src={section.image.asset.url}
            alt={section.alt || section.image.alt || ""}
            fill
            className="object-cover"
          />
        </div>
        {section.caption && (
          <p className="text-center text-sm mt-4 font-semibold" style={{ color: "#4f4f4f" }}>
            {section.caption}
          </p>
        )}
      </div>
    </div>
  );
}

function ImageGallery({ section }: { section: ContentSection }) {
  const cols = section.columns || 2;
  const images = section.images || [];
  if (images.length === 0) return null;

  return (
    <div
      className="w-full py-12 md:py-16"
      style={{ backgroundColor: section.bgColor || "transparent" }}
    >
      <div className="max-w-[1158px] mx-auto px-5">
        <div
          className="grid gap-5"
          style={{ gridTemplateColumns: `repeat(${Math.min(cols, 4)}, 1fr)` }}
        >
          {images.map((img, i) => (
            img.asset?.url && (
              <div key={i} className="relative aspect-[4/3] rounded-lg overflow-hidden">
                <Image
                  src={img.asset.url}
                  alt={img.alt || ""}
                  fill
                  className="object-cover"
                />
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
}

function ImpactCards({ section }: { section: ContentSection }) {
  const cards = section.cards || [];
  if (cards.length === 0) return null;

  return (
    <div className="max-w-[1158px] mx-auto px-5 py-12 md:py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card, i) => (
          <div
            key={i}
            className="rounded-[20px] p-10"
            style={{ backgroundColor: "#400039", color: "#faf7ef" }}
          >
            <p className="text-[clamp(40px,5vw,64px)] font-extrabold leading-none mb-3">
              {card.metric}
            </p>
            <p className="text-base leading-[1.5] opacity-80">{card.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ColorStrip({ section }: { section: ContentSection }) {
  const textColor = section.textColor || "#400039";
  return (
    <div>
      {(section.sectionLabel || section.subtitle) && (
        <div className="max-w-[1158px] mx-auto px-5 pt-16 pb-6">
          <div className="max-w-[924px]">
            {section.sectionLabel && (
              <p className="text-2xl font-semibold mb-2" style={{ color: "#400039" }}>
                {section.sectionLabel}
              </p>
            )}
            {section.subtitle && (
              <p className="text-base leading-[1.5]" style={{ color: "#666" }}>{section.subtitle}</p>
            )}
          </div>
        </div>
      )}
      <div
        className="w-full"
        style={{ backgroundColor: section.bgColor, color: textColor }}
      >
        <div className="max-w-[1400px] mx-auto px-2.5 py-12 md:py-16">
          {section.image?.asset?.url && (
            <div className="mb-8">
              <div className="relative w-full aspect-[214/100] rounded-xl overflow-hidden">
                <Image
                  src={section.image.asset.url}
                  alt={section.image.alt || ""}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}
          {section.bullets && section.bullets.length > 0 && (
            <div className="max-w-[1158px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-20">
              {section.bullets.map((bullet: unknown, i: number) => {
                const b = bullet as { title?: string; text?: string };
                return (
                  <div key={i}>
                    {b.title && <p className="text-2xl font-semibold mb-2">{b.title}</p>}
                    {b.text && <p className="text-base leading-[1.5] opacity-70">{b.text}</p>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com") || u.hostname.includes("youtu.be")) {
      const id = u.hostname.includes("youtu.be")
        ? u.pathname.slice(1)
        : u.searchParams.get("v");
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean).pop();
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
  } catch { /* invalid URL */ }
  return null;
}

function VideoBlock({ section }: { section: ContentSection }) {
  const hasUpload = !!section.videoUrl;
  const embedUrl = section.externalUrl ? getEmbedUrl(section.externalUrl) : null;
  if (!hasUpload && !embedUrl) return null;

  return (
    <div
      className="w-full py-12 md:py-16"
      style={{ backgroundColor: section.bgColor || "transparent" }}
    >
      <div className="max-w-[1158px] mx-auto px-5">
        <div className="relative w-full aspect-video rounded-xl overflow-hidden">
          {hasUpload ? (
            <video
              src={section.videoUrl}
              poster={section.poster?.asset?.url}
              controls
              autoPlay={section.autoplay}
              loop={section.loop}
              muted={section.muted}
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <iframe
              src={embedUrl!}
              title={section.caption || "Video"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          )}
        </div>
        {section.caption && (
          <p className="text-center text-sm mt-4 font-semibold" style={{ color: "#4f4f4f" }}>
            {section.caption}
          </p>
        )}
      </div>
    </div>
  );
}

function renderSection(section: ContentSection) {
  switch (section._type) {
    case "textBlock":
      return <TextBlock key={section._key} section={section} />;
    case "fullWidthImage":
      return <FullWidthImage key={section._key} section={section} />;
    case "imageGallery":
      return <ImageGallery key={section._key} section={section} />;
    case "impactCards":
      return <ImpactCards key={section._key} section={section} />;
    case "colorStrip":
      return <ColorStrip key={section._key} section={section} />;
    case "videoBlock":
      return <VideoBlock key={section._key} section={section} />;
    default:
      return null;
  }
}

export default async function ProjectDetailPage(props: PageProps) {
  const params = await props.params;
  const cookieStore = await cookies();

  try {
    const dataService = await getSanityDataService();
    const [project, profile, allProjects, { t }] = await Promise.all([
      dataService.getProjectBySlug(params.slug),
      dataService.getProfile(),
      dataService.getProjects(),
      getServerTranslations(),
    ]);

    if (!project) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center container-max">
            <h1 className="text-heading font-serif font-bold text-[#0A0A0A] mb-6">
              {t.projects.notFound}
            </h1>
            <p className="text-muted text-sm uppercase tracking-widest mb-8">
              {t.projects.notFoundDescription}
            </p>
            <Link
              href="/"
              className="text-[#0A0A0A] uppercase tracking-widest text-sm font-semibold border-b-2 border-foreground pb-1 hover:text-muted hover:border-muted transition-colors"
            >
              {t.projects.viewAllProjects}
            </Link>
          </div>
        </div>
      );
    }

    if (project.isProtected) {
      const accessCookie = cookieStore.get(`project_access_${params.slug}`);
      if (!accessCookie || !verifyCookie(params.slug, accessCookie.value)) {
        return <PasswordGate slug={params.slug} projectTitle={project.title} />;
      }
    }

    const technologies = project.getTechnologyNames();
    const contentSections = project.contentSections;
    const socialLinks = profile?.getSocialLinks?.() || profile?.socialLinks || [];
    const email = socialLinks.find((l) => l.platform === "email")?.url?.replace("mailto:", "");

    const year = project.publishedAt.getFullYear();

    return (
      <article>
        {/* Back link + header */}
        <div className="max-w-[1158px] mx-auto px-5 pt-28 md:pt-36">
          <BackToProjectsLink />

          <div className="max-w-[924px]">
            {technologies.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {technologies.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 leading-none rounded-pill border border-foreground/20 text-[#0A0A0A]/80"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}

            <h1 className="text-[clamp(32px,4vw,48px)] font-extrabold leading-[1.15] text-[#0A0A0A] mb-1">
              {project.title}
            </h1>
            {project.subtitle && (
              <p className="text-[clamp(28px,3.5vw,42px)] font-extrabold leading-[1.15] bg-gradient-to-r from-accent to-accent-purple bg-clip-text text-transparent mb-6">
                {project.subtitle}
              </p>
            )}

            <p className="text-base leading-[1.7] text-[#0A0A0A]/70 mb-6 max-w-3xl">
              {project.description}
            </p>

            <div className="flex items-center gap-2 text-sm text-[#0A0A0A]/50 mb-16">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {year}
            </div>
          </div>
        </div>

        {/* Content sections */}
        {contentSections.map((section: ContentSection) => renderSection(section))}

        {/* Links */}
        {(project.link || project.repository) && (
          <div className="max-w-[924px] mx-auto px-6 md:px-12 py-12 border-t border-border">
            <div className="flex flex-col sm:flex-row gap-4">
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 rounded-pill border border-foreground text-sm uppercase tracking-widest font-semibold text-[#0A0A0A] hover:bg-foreground hover:text-background transition-colors duration-300"
                >
                  {t.projects.viewProject} &rarr;
                </a>
              )}
              {project.repository && (
                <a
                  href={project.repository}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 rounded-pill border border-border text-sm uppercase tracking-widest font-semibold text-muted hover:border-foreground hover:text-[#0A0A0A] transition-colors duration-300"
                >
                  {t.projects.sourceCode}
                </a>
              )}
            </div>
          </div>
        )}

        {/* Next Project */}
        {(() => {
          const idx = allProjects.findIndex((p) => p.slug === params.slug);
          const next = idx >= 0 ? allProjects[(idx + 1) % allProjects.length] : null;
          return next && next.slug !== params.slug ? (
            <NextProjectCard title={next.title} description={next.description} slug={next.slug} />
          ) : null;
        })()}

        {/* Contact */}
        <ScrollReveal>
          <ContactSection
            email={email}
            socialLinks={socialLinks.filter((l) => l.platform !== "email")}
          />
        </ScrollReveal>
      </article>
    );
  } catch {
    const { t: errorT } = await getServerTranslations();
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center container-max">
          <h1 className="text-heading font-serif font-bold text-[#0A0A0A] mb-6">
            {errorT.error.unableToLoadProject}
          </h1>
          <p className="text-muted text-sm uppercase tracking-widest mb-8">
            {errorT.error.tryAgain}
          </p>
          <Link
            href="/"
            className="text-[#0A0A0A] uppercase tracking-widest text-sm font-semibold border-b-2 border-foreground pb-1 hover:text-muted hover:border-muted transition-colors"
          >
            {errorT.projects.viewAllProjects}
          </Link>
        </div>
      </div>
    );
  }
}

ProjectDetailPage.displayName = "ProjectDetailPage";
