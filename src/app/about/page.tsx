import { Metadata } from "next";
import { ProfileHeader } from "@/src/adapters/routes/components/ProfileHeader";
import { SectionBlock } from "@/src/adapters/routes/components/SectionBlock";
import { ContactSection } from "@/src/adapters/routes/components/ContactSection";
import { ScrollReveal } from "@/src/adapters/routes/components/ScrollReveal";
import { ValuesSection } from "@/src/adapters/routes/components/ValuesSection";
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

const SKILL_CHIPS = [
  { label: "Design thinking", color: "#fee8db" },
  { label: "Accessibility", color: "#fce7f3" },
  { label: "UX/UI", color: "#f3e8ff" },
  { label: "Illustration", color: "#dbeafe" },
  { label: "Design system", color: "#fedcdc" },
  { label: "Research", color: "#d2fcd8" },
  { label: "AI", color: "#f1f6be" },
];

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

  const socialLinks = profile.getSocialLinks?.() || profile.socialLinks || [];
  const email = socialLinks.find((l) => l.platform === "email")?.url?.replace("mailto:", "");
  const resumeUrl = profile.getResumeUrl?.() ?? profile.resumeUrl;

  return (
    <>
      <ProfileHeader profile={profile} profileUnavailableText={t.error.profileUnavailable} />

      <section className="container-max pb-24 md:pb-32">
        {/* Bio card */}
        <ScrollReveal>
          <div className="bg-white rounded-3xl p-8 md:p-12 mb-20 md:mb-28 shadow-[0_4px_32px_rgba(0,0,0,0.08)]">
            <h2 className="text-[clamp(28px,4vw,36px)] font-bold leading-tight mb-8 bg-gradient-to-r from-accent via-accent to-accent-purple inline-block bg-clip-text text-transparent">
              {t.about.bioHeading}
            </h2>
            <div className="space-y-6 text-lg md:text-xl text-[#0A0A0A]/70 leading-relaxed mb-10">
              {profile.aboutBio
                ? profile.aboutBio.split("\n\n").map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))
                : t.about.bio.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))
              }
            </div>

            <div className="flex flex-wrap gap-3 mb-10">
              {SKILL_CHIPS.map((chip) => (
                <span
                  key={chip.label}
                  className="inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-full"
                  style={{ backgroundColor: chip.color }}
                >
                  {chip.label}
                </span>
              ))}
            </div>

            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#0A0A0A] bg-white border-2 border-[#0A0A0A]/10 rounded-full px-6 py-4 shadow-[0_2px_8px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] hover:border-[#0A0A0A]/30 hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)] transition-all duration-300"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                {t.about.resume}
              </a>
            )}
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <ValuesSection />
        </ScrollReveal>
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
