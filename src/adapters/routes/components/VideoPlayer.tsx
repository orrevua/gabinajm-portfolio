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

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    const needsMpegts = src.endsWith(".ts");

    if (!needsMpegts) {
      video.src = src;
      return;
    }

    let player: unknown;

    import("mpegts.js").then((mpegts) => {
      if (!mpegts.default.isSupported()) {
        video.src = src;
        return;
      }
      const p = mpegts.default.createPlayer({
        type: "mpegts",
        url: src,
      });
      player = p;
      p.attachMediaElement(video);
      p.load();
      if (autoPlay) p.play();
    });

    return () => {
      if (player && typeof (player as { destroy: () => void }).destroy === "function") {
        (player as { destroy: () => void }).destroy();
      }
    };
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
