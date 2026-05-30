import Image from "next/image";
import { type IProfile } from "@domain";

export interface ProfileHeaderProps {
  profile: IProfile | null;
  profileUnavailableText?: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile, profileUnavailableText = "Profile information is currently unavailable." }) => {
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
  const avatarUrl = profile.avatar?.asset?.url;

  return (
    <header
      className="min-h-[70vh] md:min-h-screen flex items-center justify-center relative pt-28 pb-16 overflow-hidden"
      aria-label="Portfolio owner profile"
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <Image
          src="/images/logo.svg"
          alt=""
          width={600}
          height={770}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(760px,90%)] opacity-[0.06]"
          aria-hidden="true"
          loading="lazy"
        />
        <svg className="absolute top-[15%] right-[10%] w-[180px] h-[180px] md:w-[260px] md:h-[260px] animate-float-a opacity-[0.15]" viewBox="0 0 260 260" fill="none"><circle cx="130" cy="130" r="128" stroke="#ff4522" strokeWidth="2" /></svg>
        <svg className="absolute bottom-[20%] left-[8%] w-[100px] h-[100px] md:w-[160px] md:h-[160px] animate-float-b opacity-[0.12]" viewBox="0 0 160 160" fill="none"><circle cx="80" cy="80" r="78" stroke="#9ceaef" strokeWidth="2" /></svg>
        <svg className="absolute top-[40%] left-[5%] w-[14px] h-[14px] animate-float-b opacity-40" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="7" fill="#ff4522" /></svg>
        <svg className="absolute bottom-[35%] right-[5%] w-[10px] h-[10px] animate-float-a opacity-30" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="5" fill="#f992d3" /></svg>
        <svg className="absolute top-[25%] left-[20%] w-[8px] h-[8px] animate-float-a opacity-25" viewBox="0 0 8 8" fill="none"><circle cx="4" cy="4" r="4" fill="#3ddc97" /></svg>
      </div>

      <div className="container-max text-center relative z-10 flex flex-col items-center">
        {avatarUrl && (
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden mb-8 animate-fade-up border-4 border-accent-teal/30">
            <Image
              src={avatarUrl}
              alt={profile.avatar?.alt || profile.name}
              width={160}
              height={160}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        )}

        <p className="text-muted text-base mb-5 animate-fade-up">
          {profile.title}
        </p>

        <h1 className="text-display font-serif font-extrabold text-[#0A0A0A] mb-8 max-w-[668px]">
          {profile.name}
        </h1>

        {hasBio && (
          <p className="text-subheading text-[#0A0A0A]/75 leading-relaxed max-w-xl mb-12 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            {profile.bio}
          </p>
        )}
      </div>
    </header>
  );
};

ProfileHeader.displayName = "ProfileHeader";
