import { Metadata } from "next";
import { ProfileHeader } from "@/src/adapters/routes/components/ProfileHeader";
import { SectionBlock } from "@/src/adapters/routes/components/SectionBlock";
import { ContactSection } from "@/src/adapters/routes/components/ContactSection";
import { ScrollReveal } from "@/src/adapters/routes/components/ScrollReveal";
import { ValuesSection } from "@/src/adapters/routes/components/ValuesSection";
import { TranslatedHeading } from "@/src/adapters/routes/components/TranslatedHeading";
import { getSanityDataService } from "@/src/services";
import { getServerTranslations } from "@/src/i18n/serverLocale";
import type { Profile } from "@/src/domain/models/Profile";
import type { Section } from "@/src/domain/models/Section";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about my creative process, background, and vision",
  openGraph: {
    title: "About | Portfolio",
    description: "Learn more about my creative process, background, and vision",
    type: "website",
  },
};

export default async function AboutPage() {
  const { locale, t } = await getServerTranslations();

  let profile: Profile | null = null;
  let sections: Section[] = [];
  let fetchError = false;

  try {
    const dataService = await getSanityDataService();
    [profile, sections] = await Promise.all([
      dataService.getProfile(locale),
      dataService.getSections(undefined, locale),
    ]);
  } catch {
    fetchError = true;
  }

  if (fetchError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center container-max">
          <h1 className="text-heading font-serif font-bold text-foreground mb-6">
            {t.error.unableToLoad}
          </h1>
          <p className="text-muted text-sm uppercase tracking-widest mb-8">
            {t.error.tryAgain}
          </p>
          <a
            href="/"
            className="text-foreground uppercase tracking-widest text-sm font-semibold border-b-2 border-foreground pb-1 hover:text-muted hover:border-muted transition-colors"
          >
            {t.error.backToHome}
          </a>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center container-max">
          <h1 className="text-heading font-serif font-bold text-foreground mb-6">
            {t.error.profileNotFound}
          </h1>
          <p className="text-muted text-sm uppercase tracking-widest mb-8">
            {t.error.profileUnavailable}
          </p>
          <a
            href="/"
            className="text-foreground uppercase tracking-widest text-sm font-semibold border-b-2 border-foreground pb-1 hover:text-muted hover:border-muted transition-colors"
          >
            {t.error.backToHome}
          </a>
        </div>
      </div>
    );
  }

  const technologies = profile.technologies || [];
  const socialLinks = profile.getSocialLinks?.() || profile.socialLinks || [];
  const email = socialLinks.find((l) => l.platform === "email")?.url?.replace("mailto:", "");

  return (
    <>
      <ProfileHeader profile={profile} profileUnavailableText={t.error.profileUnavailable} />

      <section className="container-max pb-24 md:pb-32">
        <ScrollReveal variant="clip">
          <div className="max-w-3xl mb-20 md:mb-28">
            <h2 className="text-heading font-serif font-bold text-[#0A0A0A] mb-4 clip-target">
              {t.about.heading}
            </h2>
            <p className="text-lg text-[#0A0A0A]/60 mb-8">
              {t.about.subtitle}
            </p>
            <div className="space-y-6 text-lg md:text-xl text-[#0A0A0A]/80 leading-relaxed">
              {profile.aboutBio
                ? profile.aboutBio.split("\n\n").map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))
                : t.about.bio.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))
              }
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <ValuesSection />
        </ScrollReveal>

        {technologies.length > 0 && (
          <>
          <ScrollReveal variant="line" as="hr" className="border-0 h-px bg-border mb-0" />
          <ScrollReveal>
            <div className="py-16 md:py-20 mb-0">
              <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8 md:gap-12 items-start">
                <TranslatedHeading path="about.skillsHeading" className="uppercase tracking-widest text-sm text-accent-pink font-extrabold md:sticky md:top-28" />
                <div className="flex flex-wrap gap-3">
                  {technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-[11px] font-sans text-[#0A0A0A] uppercase tracking-widest border border-border rounded-pill px-4 py-2 hover:bg-[#0A0A0A] hover:text-background transition-colors duration-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </>
        )}
      </section>

      {sections.map((section) => (
        <ScrollReveal key={section.id}>
          <SectionBlock section={section} />
        </ScrollReveal>
      ))}

      <ScrollReveal>
        <ContactSection
          email={email}
          socialLinks={socialLinks.filter((l) => l.platform !== "email")}
        />
      </ScrollReveal>
    </>
  );
}

AboutPage.displayName = "AboutPage";
