"use client";

import { useRef, useCallback } from "react";

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
  const retriedRef = useRef(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleError = useCallback(() => {
    if (retriedRef.current || !videoRef.current) return;
    if (src.includes("cdn.sanity.io/files/")) {
      retriedRef.current = true;
      videoRef.current.src = `/api/video?url=${encodeURIComponent(src)}`;
      videoRef.current.load();
    }
  }, [src]);

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      controls={controls}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      playsInline
      preload="metadata"
      onError={handleError}
      className={className}
    />
  );
}
