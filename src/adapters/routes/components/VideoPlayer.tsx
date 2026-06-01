"use client";

import { useEffect, useRef } from "react";

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<unknown>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    const isSanityTS =
      src.includes("cdn.sanity.io/files/") && src.endsWith(".ts");

    if (!isSanityTS) {
      video.src = src;
      return undefined;
    }

    const manifestUrl = `/api/video?url=${encodeURIComponent(src)}&format=m3u8`;

    let cancelled = false;

    import("hls.js").then(({ default: Hls }) => {
      if (cancelled || !video) return;

      if (Hls.isSupported()) {
        const hls = new Hls();
        hlsRef.current = hls;
        hls.loadSource(manifestUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (autoPlay) video.play();
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = manifestUrl;
        if (autoPlay) video.play();
      }
    });

    return () => {
      cancelled = true;
      if (hlsRef.current) {
        (hlsRef.current as { destroy: () => void }).destroy();
        hlsRef.current = null;
      }
    };
  }, [src, autoPlay]);

  return (
    <video
      ref={videoRef}
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
