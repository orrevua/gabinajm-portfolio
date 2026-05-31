"use client";

import { useMemo } from "react";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  controls?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  className?: string;
}

export function VideoPlayer({
  src,
  poster,
  controls = true,
  autoPlay,
  loop,
  muted,
  className,
}: VideoPlayerProps) {
  const videoSrc = useMemo(() => {
    if (src.includes("cdn.sanity.io/files/") && src.endsWith(".ts")) {
      return `/api/video?url=${encodeURIComponent(src)}`;
    }
    return src;
  }, [src]);

  return (
    <video
      src={videoSrc}
      poster={poster}
      controls={controls}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      playsInline
      preload="metadata"
      className={className}
    />
  );
}
