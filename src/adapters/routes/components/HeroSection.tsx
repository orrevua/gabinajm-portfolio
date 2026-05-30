import Image from "next/image";
import { type IProfile } from "@domain";

export interface HeroSectionProps {
  profile: IProfile;
  greeting?: string;
  intro?: string;
  ctaPrimaryLabel?: string;
  ctaPrimaryHref?: string;
  ctaSecondaryLabel?: string;
  ctaSecondaryHref?: string;
}

const SparkleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M12 2L13.09 8.26L18 6L14.74 10.91L21 12L14.74 13.09L18 18L13.09 15.74L12 22L10.91 15.74L6 18L9.26 13.09L3 12L9.26 10.91L6 6L10.91 8.26L12 2Z" fill="currentColor" />
  </svg>
);

export const HeroSection: React.FC<HeroSectionProps> = ({
  profile,
  greeting,
  intro = "I'm",
  ctaPrimaryLabel,
  ctaPrimaryHref = "#contact",
  ctaSecondaryLabel,
  ctaSecondaryHref = "#about",
}) => {
  const avatarUrl = profile.avatar?.asset?.url;

  return (
    <header
      className="min-h-[70vh] md:min-h-[85vh] flex items-center relative pt-28 pb-16 overflow-hidden"
      aria-label="Portfolio hero"
    >
      <div className="container-max relative z-10 flex flex-col-reverse md:flex-row items-center gap-12 md:gap-8">
        <div className="flex-1 max-w-xl">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-pill bg-accent/10 text-accent text-sm font-semibold mb-6">
            <SparkleIcon />
            {profile.title}
          </span>

          <h1 className="text-display font-extrabold text-[#0A0A0A] mb-6 leading-[1]">
            {greeting}{" "}
            <span className="inline-block animate-wave origin-[70%_70%]" aria-hidden="true">
              {"\u{1F44B}"}
            </span>
            <br />
            {intro}{" "}
            <span className="inline-flex items-baseline whitespace-nowrap">
              <span className="relative bg-gradient-to-r from-accent via-accent to-accent-purple inline-block bg-clip-text text-transparent">
                Gabi
              </span>
              <span className="text-[#0A0A0A]">,</span>
            </span>
          </h1>

          <p className="text-lg text-[#0A0A0A]/70 leading-relaxed mb-8 max-w-md">
            {profile.bio}
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href={ctaPrimaryHref}
              className="px-7 py-3.5 rounded-pill bg-gradient-to-r from-accent to-accent-purple text-white font-semibold shadow-[0_10px_20px_rgba(246,51,154,0.3)] hover:shadow-[0_14px_28px_rgba(246,51,154,0.45)] hover:opacity-90 transition-shadow transition-opacity"
            >
              {ctaPrimaryLabel}
            </a>
            <a
              href={ctaSecondaryHref}
              className="px-7 py-3.5 rounded-pill border-2 border-accent text-[#0A0A0A] font-semibold shadow-[0_10px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_14px_28px_rgba(246,51,154,0.45)] hover:bg-accent hover:text-background transition-colors transition-shadow"
            >
              {ctaSecondaryLabel}
            </a>
          </div>
        </div>

        {avatarUrl && (
          <div className="flex-1 flex justify-center md:justify-end">
            <div className="relative w-[320px] h-[320px] md:w-[500px] md:h-[500px]">
              <Image
                src={avatarUrl}
                alt={profile.avatar?.alt || profile.name}
                fill
                className="object-contain"
                priority
                sizes="(max-width: 768px) 320px, 500px"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

HeroSection.displayName = "HeroSection";
