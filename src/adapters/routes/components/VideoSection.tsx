export interface VideoSectionProps {
  heading?: string;
  subtitle?: string;
  videoUrl?: string;
  externalUrl?: string;
  poster?: { asset: { url: string; lqip?: string }; alt?: string };
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
}

function getEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com") || u.hostname.includes("youtu.be")) {
      const id = u.hostname.includes("youtu.be")
        ? u.pathname.slice(1)
        : u.searchParams.get("v");
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean).pop();
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
  } catch { /* invalid URL */ }
  return null;
}

export const VideoSection: React.FC<VideoSectionProps> = ({
  heading,
  subtitle,
  videoUrl,
  externalUrl,
  poster,
  autoplay = false,
  loop = false,
  muted = true,
}) => {
  const hasUpload = !!videoUrl;
  const embedUrl = externalUrl ? getEmbedUrl(externalUrl) : null;
  if (!hasUpload && !embedUrl) return null;

  return (
    <section className="container-max py-12 md:py-20" aria-label={heading || "Video"}>
      {heading && (
        <h2 className="text-heading font-extrabold text-[#0A0A0A] mb-2">
          {heading}
        </h2>
      )}
      {subtitle && (
        <p className="text-base text-muted mb-8">{subtitle}</p>
      )}

      <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-sm">
        {hasUpload ? (
          <video
            src={videoUrl}
            poster={poster?.asset?.url}
            controls
            autoPlay={autoplay}
            loop={loop}
            muted={muted}
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <iframe
            src={embedUrl!}
            title={heading || "Video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        )}
      </div>
    </section>
  );
};

VideoSection.displayName = "VideoSection";
