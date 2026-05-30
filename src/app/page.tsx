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
  try {
    const dataService = getSanityDataService();

    const [profile, projects, homePage, { t }] = await Promise.all([
      dataService.getProfile(),
      dataService.getFeaturedProjects(4),
      dataService.getHomePage(),
      getServerTranslations(),
    ]);

    if (!profile) {
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

    const socialLinks = profile.getSocialLinks?.() || profile.socialLinks || [];
    const email = socialLinks.find((l) => l.platform === "email")?.url?.replace("mailto:", "");

    return (
      <>
        <HeroSection
          profile={profile}
          greeting={heroConfig?.greeting || t.hero.greeting}
          intro={t.hero.intro.trim()}
          ctaPrimaryLabel={heroConfig?.ctaPrimaryLabel || t.hero.ctaPrimary}
          ctaPrimaryHref={heroConfig?.ctaPrimaryHref}
          ctaSecondaryLabel={heroConfig?.ctaSecondaryLabel || t.hero.ctaSecondary}
          ctaSecondaryHref={heroConfig?.ctaSecondaryHref}
        />

        <ScrollReveal>
          <AboutSection
            profile={profile}
            heading={aboutConfig?.heading || t.about.heading}
            body={aboutConfig?.body}
            showResume={aboutConfig?.showResume}
            showSkills={aboutConfig?.showSkills}
            showMoreLabel={t.about.showMore}
            resumeLabel={t.about.resume}
          />
        </ScrollReveal>

        {projects && projects.length > 0 && (
          <ScrollReveal>
            <ProjectGrid
              title={projectsConfig?.heading || t.projects.heading}
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
              heading={experienceConfig?.heading || t.pastExperience.heading}
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
            availabilityText={contactConfig?.availabilityText}
          />
        </ScrollReveal>
      </>
    );
  } catch {
    const { t: errorT } = await getServerTranslations();
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center container-max">
          <h1 className="text-heading font-bold text-[#0A0A0A] mb-6">
            {errorT.error.unableToLoad}
          </h1>
          <p className="text-muted text-sm mb-8">{errorT.error.tryAgain}</p>
          <a href="/" className="text-[#0A0A0A] font-semibold border-b-2 border-foreground pb-1 hover:text-muted hover:border-muted transition-colors">
            {errorT.error.refreshPage}
          </a>
        </div>
      </div>
    );
  }
}

HomePage.displayName = "HomePage";
