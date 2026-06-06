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
  let fetchError = false;

  try {
    const dataService = getSanityDataService();
    [profile, projects, homePage] = await Promise.all([
      dataService.getProfile(locale),
      dataService.getFeaturedProjects(4, locale),
      dataService.getHomePage(locale),
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
  const socialLinks = profile.getSocialLinks();
  const email = socialLinks.find((l) => l.platform === "email")?.url?.replace("mailto:", "");

  return (
    <>
      <HeroSection
        profile={profile}
        greeting={hp?.greeting || t.hero.greeting}
        intro={t.hero.intro.trim()}
        ctaPrimaryLabel={hp?.ctaPrimaryLabel || t.hero.ctaPrimary}
        ctaPrimaryHref={hp?.ctaPrimaryHref}
        ctaSecondaryLabel={hp?.ctaSecondaryLabel || t.hero.ctaSecondary}
        ctaSecondaryHref={hp?.ctaSecondaryHref}
      />

      <ScrollReveal>
        <AboutSection
          heading={hp?.aboutHeading || t.about.heading}
          body={hp?.aboutBody || t.about.homeAboutSummary}
          showResume={hp?.showResume}
          showSkills={hp?.showSkills}
          showMoreLabel={t.about.showMore}
          resumeLabel={t.about.resume}
          resumeUrl={profile.getResumeUrl() ?? undefined}
          technologies={profile.technologies}
        />
      </ScrollReveal>

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
              technologies: project.technologies.map((t) => ({ name: t.name, iconUrl: t.iconUrl })),
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
            heading={hp?.experienceHeading || t.pastExperience.heading}
          />
        </ScrollReveal>
      )}

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

      <ScrollReveal>
        <ContactSection
          heading={hp?.contactHeading}
          subtitle={hp?.contactSubtitle}
          email={email}
          socialLinks={socialLinks.filter((l) => l.platform !== "email")}
          availabilityText={hp?.availabilityText}
        />
      </ScrollReveal>
    </>
  );
}

HomePage.displayName = "HomePage";
