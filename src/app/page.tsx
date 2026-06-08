import { Metadata } from "next";
import { HeroSection } from "@/src/adapters/routes/components/HeroSection";
import { ProjectGrid } from "@/src/adapters/routes/components/ProjectGrid";
import { VideoSection } from "@/src/adapters/routes/components/VideoSection";
import { ScrollReveal } from "@/src/adapters/routes/components/ScrollReveal";
import { SectionRouter } from "@/src/adapters/routes/components/SectionRouter";
import { buildSanityImageUrl, getSanityDataService } from "@/src/services";
import { getServerTranslations } from "@/src/i18n/serverLocale";
import type { Profile } from "@/src/domain/models/Profile";
import type { Project } from "@/src/domain/models/Project";
import type { Section } from "@/src/domain/models/Section";
import type { HomePage as HomePageData } from "@/src/domain/interfaces/DataService";
import { toPlainText } from "@/src/domain/types";

const CARD_IMAGE_WIDTH = 1200;
const CARD_IMAGE_HEIGHT = 750;

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Gabinajm",
  description: "Product Designer crafting accessible and human-centered experiences",
  openGraph: {
    title: "Gabinajm | Portfolio",
    description: "Product Designer crafting accessible and human-centered experiences",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Gabinajm — Product Designer Portfolio" }],
  },
};

export default async function HomePage() {
  const { locale, t } = await getServerTranslations();

  let profile: Profile | null = null;
  let projects: Project[] = [];
  let homePage: HomePageData | null = null;
  let sections: Section[] = [];
  let fetchError = false;

  try {
    const dataService = getSanityDataService();
    [profile, projects, homePage, sections] = await Promise.all([
      dataService.getProfile(locale),
      dataService.getFeaturedProjects(undefined, locale),
      dataService.getHomePage(locale),
      dataService.getSectionsByPage("home", locale),
    ]);
  } catch {
    fetchError = true;
  }

  if (fetchError || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center container-max">
          <h1 className="text-heading font-bold text-[#0A0A0A] mb-6">
            {t.error.unableToLoad}
          </h1>
          <p className="text-muted text-sm mb-8">{t.error.tryAgain}</p>
          <a href="/" className="text-[#0A0A0A] font-semibold border-b-2 border-foreground pb-1 hover:text-muted hover:border-muted transition-colors">
            {t.error.refreshPage}
          </a>
        </div>
      </div>
    );
  }

  const hp = homePage;

  const aboutSection = sections.find((s) => s.sectionType === "about-preview");
  const contactSection = sections.find((s) => s.sectionType === "contact");
  const genericSections = sections.filter((s) => s.sectionType === "generic");

  return (
    <>
      <HeroSection
        profile={profile}
        greeting={profile.greeting || t.hero.greeting}
        intro={t.hero.intro.trim()}
        heroName={profile.heroName || t.hero.name}
        ctaPrimaryLabel={profile.ctaPrimaryLabel || t.hero.ctaPrimary}
        ctaPrimaryHref={profile.ctaPrimaryHref || undefined}
        ctaSecondaryLabel={profile.ctaSecondaryLabel || t.hero.ctaSecondary}
        ctaSecondaryHref={profile.ctaSecondaryHref || undefined}
      />

      {aboutSection && (
        <SectionRouter section={aboutSection} showMoreLabel={t.about.showMore} resumeLabel={t.about.resume} />
      )}

      {projects && projects.length > 0 && (
        <ScrollReveal>
          <ProjectGrid
            title={hp?.projectsHeading || t.projects.heading}
            projects={projects.map((project) => ({
              title: project.title,
              slug: project.slug,
              description: project.excerpt || toPlainText(project.description),
              mainImage: project.mainImage?.asset
                ? {
                    url: buildSanityImageUrl(
                      {
                        assetRef: project.mainImage.assetRef,
                        assetId: project.mainImage.asset.id,
                        crop: project.mainImage.crop,
                        hotspot: project.mainImage.hotspot,
                      },
                      {
                        width: CARD_IMAGE_WIDTH,
                        height: CARD_IMAGE_HEIGHT,
                        fit: project.mainImageCrop === "full" ? "max" : "crop",
                      }
                    ) || project.mainImage.asset.url,
                    lqip: project.mainImage.asset.lqip || "",
                    alt: project.mainImage.alt || project.title,
                  }
                : undefined,
              imageFit: project.mainImageCrop === "full" ? "contain" : "cover",
              technologies: project.technologies.map((t) => ({ name: t.name, iconUrl: t.iconUrl, color: t.color })),
              link: project.getPrimaryUrl() || undefined,
              featured: project.featured,
              isProtected: project.isProtected,
            }))}
          />
        </ScrollReveal>
      )}

      {sections.filter((s) => s.sectionType === "past-experience").map((section) => (
        <SectionRouter key={section.id} section={section} />
      ))}

      {hp?.videoUrl || hp?.videoExternalUrl ? (
        <ScrollReveal>
          <VideoSection
            heading={hp.videoHeading}
            subtitle={hp.videoSubtitle}
            videoUrl={hp.videoUrl}
            externalUrl={hp.videoExternalUrl}
            poster={hp.videoPoster}
            autoplay={hp.videoAutoplay}
            loop={hp.videoLoop}
            muted={hp.videoMuted}
          />
        </ScrollReveal>
      ) : null}

      {genericSections.map((section) => (
        <SectionRouter key={section.id} section={section} />
      ))}

      {contactSection && <SectionRouter section={contactSection} />}
    </>
  );
}

HomePage.displayName = "HomePage";
