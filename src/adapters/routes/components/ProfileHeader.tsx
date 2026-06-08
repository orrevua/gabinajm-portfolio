import Image from "next/image";
import { type IProfile } from "@domain";
import type { ProfileAvatar } from "@/src/domain/types";

export interface ProfileHeaderProps {
  profile: IProfile | null;
  heroImage?: ProfileAvatar | null;
  profileUnavailableText?: string;
  heading?: string;
}

const StarIcon = () => (
  <Image src="/images/star_icon.svg" alt="" width={16} height={16} aria-hidden="true" />
);

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  heroImage,
  profileUnavailableText = "Profile information is currently unavailable.",
  heading = "About Me",
}) => {
  if (!profile) {
    return (
      <section className="container-max py-32 text-center" aria-label="Profile">
        <p className="text-muted uppercase tracking-widest text-sm">
          {profileUnavailableText}
        </p>
      </section>
    );
  }

  const hasBio = profile.bio && profile.bio.trim().length > 0;
  const headerImage = heroImage ?? profile.avatar;
  const imageUrl = headerImage?.asset?.url;

  return (
    <header
      className="container-max py-24 md:pt-36 md:pb-6"
      aria-label={heading}
    >
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(280px,360px)_1fr] lg:gap-14 border-none">
        {imageUrl && (
          <div className="relative aspect-square overflow-hidden rounded-[32px] bg-gradient-to-br from-[#FCE7F3] via-[#F5D0FE] to-[#DDD6FE] shadow-[0_30px_60px_rgba(10,10,10,0.18),0_8px_24px_rgba(0,0,0,0.12)] ring-1 ring-white/70">
            <Image
              src={imageUrl}
              alt={headerImage?.alt || profile.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 360px"
            />
          </div>
        )}

        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-pill bg-accent/10 text-accent text-sm font-semibold mb-6">
            <StarIcon />
            {profile.title}
          </span>

          <h1 className="text-display font-extrabold text-[#0A0A0A] mb-6 leading-[1.05]">
            {heading}
          </h1>

          {hasBio && (
            <p className="text-xl text-[#0A0A0A]/75 leading-relaxed max-w-lg">
              {profile.bio}
            </p>
          )}
        </div>
      </div>
    </header>
  );
};

ProfileHeader.displayName = "ProfileHeader";
