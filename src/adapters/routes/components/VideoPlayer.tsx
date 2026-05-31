"use client";

import { useEffect, useRef } from "react";
import Hls from "hls.js";

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
  const hlsRef = useRef<Hls | null>(null);

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

    if (Hls.isSupported()) {
      const hls = new Hls();
      hlsRef.current = hls;
      hls.loadSource(manifestUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (autoPlay) video.play();
      });
      return () => {
        hls.destroy();
        hlsRef.current = null;
      };
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = manifestUrl;
      if (autoPlay) video.play();
    }
    return undefined;
  }, [src, autoPlay]);

  return (
    <video
      ref={videoRef}
      poster={poster}
      controls={controls}
      loop={loop}
      muted={muted}
      playsInline
      preload="metadata"
      className={className}
    />
  );
}
