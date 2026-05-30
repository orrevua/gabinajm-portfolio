import Image from "next/image";
import { type IProfile } from "@domain";

export interface AboutSectionProps {
  profile: IProfile;
  heading?: string;
  body?: string;
  showResume?: boolean;
  showSkills?: boolean;
  showMoreLabel?: string;
  resumeLabel?: string;
}

const SKILL_ICONS: Record<string, React.ReactNode> = {
  acessibility: (
    <Image src="/images/acessibility.svg" alt="" width={16} height={16} aria-hidden="true" />
  ),
  "ux/ui": (
    <Image src="/images/smartphone.svg" alt="" width={16} height={16} aria-hidden="true" />
  ),
  illustration: (
    <Image src="/images/illustration.svg" alt="" width={16} height={16} aria-hidden="true" />
  ),
  research: (
    <Image src="/images/research.svg" alt="" width={16} height={16} aria-hidden="true" />
  ),
};

const SKILL_BADGE_CLASSES: Record<string, string> = {
  accessibility: "bg-accent/10 text-accent",
  "ux/ui": "bg-accent-purple/10 text-accent-purple",
  illustration: "bg-[#E0F2FE] text-[#2563EB]",
  research: "bg-[#DCFCE7] text-[#16A34A]",
};

function getSkillIcon(skill: string): React.ReactNode {
  const key = skill.toLowerCase();
  return SKILL_ICONS[key] || (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

function getSkillBadgeClasses(skill: string): string {
  const key = skill.toLowerCase();
  return SKILL_BADGE_CLASSES[key] || "bg-background text-foreground";
}

const DownloadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

export const AboutSection: React.FC<AboutSectionProps> = ({
  profile,
  heading = "About Me",
  body,
  showResume = true,
  showSkills = true,
  showMoreLabel = "Show more",
  resumeLabel = "My resume",
}) => {
  const bioText = body || profile.aboutBio || profile.bio;
  const hasResume = showResume && profile.resumeUrl;
  const hasSkills = showSkills && profile.technologies.length > 0;
  const showCtaRow = hasResume || showSkills;

  return (
    <section className="container-max py-12 md:py-20" aria-label={heading} id="about">
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
        <h2 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-accent via-accent to-accent-purple inline-block bg-clip-text text-transparent mb-6 p-1">
          {heading}
        </h2>

        <p className="text-base md:text-lg text-[#0A0A0A]/80 leading-relaxed max-w-3xl mb-8">
          {bioText}
        </p>
        {hasSkills && (
          <div className="flex flex-wrap gap-3 mb-8">
            {profile.technologies.map((skill) => (
              <span
                key={skill}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-pill text-sm font-medium shadow-[0_6px_12px_rgba(0,0,0,0.08)] ${getSkillBadgeClasses(skill)}`}
              >
                {getSkillIcon(skill)}
                {skill}
              </span>
            ))}
          </div>
        )}

        {showCtaRow && (
          <div className="flex flex-wrap gap-4">
            <a
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-pill bg-gradient-to-r from-accent to-accent-purple text-white font-semibold shadow-[0_10px_20px_rgba(246,51,154,0.3)] hover:shadow-[0_14px_28px_rgba(246,51,154,0.45)] hover:opacity-90 transition-shadow transition-opacity"
            >
              {showMoreLabel}
            </a>
            {hasResume && (
              <a
                href={profile.resumeUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-pill border-2 border-accent text-[#0A0A0A] font-semibold shadow-[0_10px_20px_rgba(246,51,154,0.2)] hover:shadow-[0_14px_28px_rgba(246,51,154,0.3)] hover:bg-accent hover:text-white transition-colors transition-shadow"
              >
                <DownloadIcon />
                {resumeLabel}
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

AboutSection.displayName = "AboutSection";
