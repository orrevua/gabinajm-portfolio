import { Metadata } from "next";
import Image from "next/image";
import { ProfileHeader } from "@/src/adapters/routes/components/ProfileHeader";
import { SectionRouter } from "@/src/adapters/routes/components/SectionRouter";
import { PortableTextRenderer } from "@/src/adapters/routes/components/PortableTextRenderer";
import { ScrollReveal } from "@/src/adapters/routes/components/ScrollReveal";
import { getSanityDataService } from "@/src/services";
import { getServerTranslations } from "@/src/i18n/serverLocale";
import type { Profile } from "@/src/domain/models/Profile";
import type { Section } from "@/src/domain/models/Section";
import type { AboutPage as AboutPageData } from "@/src/domain/interfaces/DataService";

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

const SKILL_CHIPS: Array<{ label: string; iconUrl?: string; color: string }> = [
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
  let aboutPage: AboutPageData | null = null;
  let fetchError = false;

  try {
    const dataService = await getSanityDataService();
    [profile, sections, aboutPage] = await Promise.all([
      dataService.getProfile(locale),
      dataService.getSectionsByPage("about", locale),
      dataService.getAboutPage(locale),
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

  const aboutPreviewSection = sections.find((s) => s.sectionType === "about-preview");
  const aboutBlock = aboutPreviewSection?.contentBlocks.find((b) => b._type === "aboutPreviewBlock");
  const resumeUrl = aboutBlock?.resumeUrl || null;
  const aboutBio = aboutPage?.bio;
  const aboutHeroImage = aboutPage?.heroImage;

  const contactSection = sections.find((s) => s.sectionType === "contact");
  const otherSections = sections.filter((s) => s.sectionType !== "contact" && s.sectionType !== "about-preview");

  return (
    <>
      <ProfileHeader
        profile={profile}
        heroImage={aboutHeroImage}
        profileUnavailableText={t.error.profileUnavailable}
        heading={t.about.heading}
      />

      <section className="container-max pb-24 md:pb-32 mt-10 md:mt-16">
        {/* Bio card */}
        <ScrollReveal>
          <div className="bg-white rounded-3xl p-8 md:p-12 mb-20 md:mb-28 drop-shadow-2xl">
            <h2 className="text-[clamp(28px,4vw,36px)] font-bold leading-tight mb-8 bg-gradient-to-r from-accent via-accent to-accent-purple inline-block bg-clip-text text-transparent">
              {aboutPage?.bioHeading || t.about.bioHeading}
            </h2>
            <div className="space-y-6 text-lg text-[#0A0A0A]/70 leading-relaxed mb-10">
              {aboutBio ? (
                <PortableTextRenderer value={aboutBio} />
              ) : (
                t.about.bio.map((paragraph, i) => <p key={i}>{paragraph}</p>)
              )}
            </div>

            <div className="flex flex-wrap gap-3 mb-10">
              {(aboutPage?.skillChips && aboutPage.skillChips.length > 0
                ? aboutPage.skillChips
                : SKILL_CHIPS
              ).map((chip) => (
                <span
                  key={chip.label}
                  className="inline-flex items-center gap-2 text-base font-normal px-5 py-2.5 rounded-full"
                  style={{ backgroundColor: chip.color }}
                >
                  {chip.iconUrl && (
                    <Image src={chip.iconUrl} alt="" width={16} height={16} className="object-contain" aria-hidden="true" />
                  )}
                  {chip.label}
                </span>
              ))}
            </div>

            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-pill border-2 border-accent text-[#0A0A0A] font-semibold shadow-[0_10px_20px_rgba(246,51,154,0.2)] hover:shadow-[0_14px_28px_rgba(246,51,154,0.3)] hover:bg-accent hover:text-white active:scale-95 transition-all duration-150"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                {t.about.resume}
              </a>
            )}
          </div>
        </ScrollReveal>

      </section>

      {otherSections.map((section) => (
        <SectionRouter key={section.id} section={section} />
      ))}

      {contactSection && <SectionRouter section={contactSection} />}
    </>
  );
}

AboutPage.displayName = "AboutPage";
