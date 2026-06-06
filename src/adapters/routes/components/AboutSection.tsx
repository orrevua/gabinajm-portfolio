import Image from "next/image";
import type { SkillTag } from "@/src/domain/types";
import { PortableTextRenderer } from "./PortableTextRenderer";

export interface AboutSectionProps {
  heading?: string;
  body?: string;
  showResume?: boolean;
  showSkills?: boolean;
  showMoreLabel?: string;
  resumeLabel?: string;
  resumeUrl?: string;
  technologies?: SkillTag[];
}

const DownloadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

export const AboutSection: React.FC<AboutSectionProps> = ({
  heading = "About Me",
  body,
  showResume = true,
  showSkills = true,
  showMoreLabel = "Show more",
  resumeLabel = "My resume",
  resumeUrl,
  technologies = [],
}) => {
  const hasResume = showResume && resumeUrl;
  const hasSkills = showSkills && technologies.length > 0;
  const showCtaRow = hasResume || showSkills;

  return (
    <section className="container-max py-12 md:py-20" aria-label={heading} id="about">
      <div className="bg-white rounded-3xl p-8 md:p-12 drop-shadow-2xl">
        <h2 className="text-[36px] font-bold bg-gradient-to-r from-accent via-accent to-accent-purple inline-block bg-clip-text text-transparent mb-6 p-1">
          {heading}
        </h2>

        <div className="text-base md:text-lg text-[#0A0A0A]/80 leading-relaxed mb-8 space-y-4">
          {body ? (
            body.split("\n\n").map((paragraph, index) => <p key={index}>{paragraph}</p>)
          ) : (
            <PortableTextRenderer value={null} />
          )}
        </div>
        {hasSkills && (
          <div className="flex flex-wrap gap-3 mb-8">
            {technologies.map((skill) => (
              <span
                key={skill.name}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-pill text-base font-normal ${skill.color || "bg-background text-foreground"}`}
              >
                {skill.iconUrl && (
                  <Image src={skill.iconUrl} alt="" width={16} height={16} className="object-contain" aria-hidden="true" />
                )}
                {skill.name}
              </span>
            ))}
          </div>
        )}

        {showCtaRow && (
          <div className="flex flex-wrap gap-4">
            <a
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-pill bg-gradient-to-r from-accent to-accent-purple text-white font-bold shadow-[0_10px_20px_rgba(246,51,154,0.3)] hover:shadow-[0_14px_28px_rgba(246,51,154,0.45)] hover:opacity-90 active:scale-95 transition-all duration-150"
            >
              {showMoreLabel}
            </a>
            {hasResume && (
              <a
                href={resumeUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-pill border-2 border-accent text-[#0A0A0A] font-bold shadow-[0_10px_20px_rgba(246,51,154,0.2)] hover:shadow-[0_14px_28px_rgba(246,51,154,0.3)] hover:bg-accent hover:text-white active:scale-95 transition-all duration-150"
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
