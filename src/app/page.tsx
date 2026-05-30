import { Metadata } from "next";
import { HeroSection } from "@/src/adapters/routes/components/HeroSection";
import { AboutSection } from "@/src/adapters/routes/components/AboutSection";
import { ProjectGrid } from "@/src/adapters/routes/components/ProjectGrid";
import { PastExperience } from "@/src/adapters/routes/components/PastExperience";
import { ContactSection } from "@/src/adapters/routes/components/ContactSection";
import { VideoSection } from "@/src/adapters/routes/components/VideoSection";
import { ScrollReveal } from "@/src/adapters/routes/components/ScrollReveal";
import { buildSanityImageUrl, getSanityDataService } from "@/src/services";
import { getServerTranslations } from "@/src/i18n/serverLocale";
import type { Profile } from "@/src/domain/models/Profile";
import type { Project } from "@/src/domain/models/Project";
import type { HomePage as HomePageData } from "@/src/domain/interfaces/DataService";

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
  },
};

export default async function HomePage() {
  const { locale, t } = await getServerTranslations();

  let profile: Profile | null = null;
  let projects: Project[] = [];
  let homePage: HomePageData | null = null;
  let fetchError = false;

  try {
    const dataService = getSanityDataService();
    [profile, projects, homePage] = await Promise.all([
      dataService.getProfile(locale),
      dataService.getFeaturedProjects(4, locale),
      dataService.getHomePage(),
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

  const sections = homePage?.sections || [];
  const heroConfig = sections.find((s) => s._type === "heroSection");
  const aboutConfig = sections.find((s) => s._type === "aboutSection");
  const projectsConfig = sections.find((s) => s._type === "projectsSection");
  const experienceConfig = sections.find((s) => s._type === "experienceSection");
  const contactConfig = sections.find((s) => s._type === "contactSection");
  const videoSections = sections.filter((s) => s._type === "videoSection");

  type S = typeof sections[number];
  const lf = (s: S | undefined, field: keyof S, fallback: string) => {
    const ptKey = `${String(field)}_pt` as keyof S;
    if (locale === "pt") return (s?.[ptKey] as string) || (s?.[field] as string) || fallback;
    return (s?.[field] as string) || fallback;
  };

  const socialLinks = profile.getSocialLinks?.() || profile.socialLinks || [];
  const email = socialLinks.find((l) => l.platform === "email")?.url?.replace("mailto:", "");

  return (
    <>
      <HeroSection
        profile={profile}
        greeting={lf(heroConfig, "greeting", t.hero.greeting)}
        intro={t.hero.intro.trim()}
        ctaPrimaryLabel={lf(heroConfig, "ctaPrimaryLabel", t.hero.ctaPrimary)}
        ctaPrimaryHref={heroConfig?.ctaPrimaryHref}
        ctaSecondaryLabel={lf(heroConfig, "ctaSecondaryLabel", t.hero.ctaSecondary)}
        ctaSecondaryHref={heroConfig?.ctaSecondaryHref}
      />

      <ScrollReveal>
        <AboutSection
          profile={profile}
          heading={lf(aboutConfig, "heading", t.about.heading)}
          body={locale === "pt" ? (aboutConfig?.body_pt || aboutConfig?.body) : aboutConfig?.body}
          showResume={aboutConfig?.showResume}
          showSkills={aboutConfig?.showSkills}
          showMoreLabel={t.about.showMore}
          resumeLabel={t.about.resume}
        />
      </ScrollReveal>

      {projects && projects.length > 0 && (
        <ScrollReveal>
          <ProjectGrid
            title={lf(projectsConfig, "heading", t.projects.heading)}
            projects={projects.map((project) => ({
              title: project.title,
              slug: project.slug,
              description: project.description,
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
              technologies: project.getTechnologyNames(),
              link: project.getPrimaryUrl() || undefined,
              featured: project.featured,
              isProtected: project.isProtected,
            }))}
          />
        </ScrollReveal>
      )}

      {profile.pastExperience.length > 0 && (
        <ScrollReveal>
          <PastExperience
            companies={profile.pastExperience}
            heading={lf(experienceConfig, "heading", t.pastExperience.heading)}
          />
        </ScrollReveal>
      )}

      {videoSections.map((vc) => (
        <ScrollReveal key={vc._key}>
          <VideoSection
            heading={vc.heading}
            subtitle={vc.subtitle}
            videoUrl={vc.videoUrl}
            externalUrl={vc.externalUrl}
            poster={vc.poster}
            autoplay={vc.autoplay}
            loop={vc.loop}
            muted={vc.muted}
          />
        </ScrollReveal>
      ))}

      <ScrollReveal>
        <ContactSection
          email={email}
          socialLinks={socialLinks.filter((l) => l.platform !== "email")}
          availabilityText={locale === "pt" ? (contactConfig?.availabilityText_pt || contactConfig?.availabilityText) : contactConfig?.availabilityText}
        />
      </ScrollReveal>
    </>
  );
}

HomePage.displayName = "HomePage";
