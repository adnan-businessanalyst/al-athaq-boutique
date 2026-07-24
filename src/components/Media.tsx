"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { MediaKind } from "@/types";
import { mediaTypeFromUrl } from "@/lib/media-utils";
import { DiamondMotif } from "@/components/DiamondMotif";

export type MediaProps = {
  src: string | null | undefined;
  alt: string;
  mediaType?: MediaKind;
  posterUrl?: string | null;
  /** Positioning / size of the media frame (e.g. "absolute inset-0") */
  className?: string;
  /** Classes applied to the img/video element */
  imgClassName?: string;
  priority?: boolean;
  sizes?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  fallbackGradient?: string;
  autoPlay?: boolean;
};

function Placeholder({
  className,
  fallbackGradient,
  alt,
}: {
  className?: string;
  fallbackGradient: string;
  alt: string;
}) {
  return (
    <div
      className={`flex items-center justify-center overflow-hidden ${className ?? ""}`}
      style={{ background: fallbackGradient }}
      role="img"
      aria-label={alt}
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(251,245,236,0.2) 1px, transparent 1.5px)",
          backgroundSize: "18px 18px",
        }}
      />
      <DiamondMotif size={72} tone="light" className="relative z-10 opacity-90" />
    </div>
  );
}

function LoopingVideo({
  src,
  alt,
  posterUrl,
  className,
  autoPlay,
}: {
  src: string;
  alt: string;
  posterUrl?: string | null;
  className: string;
  autoPlay: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    video.loop = true;
    video.muted = true;
    video.playsInline = true;

    const tryPlay = () => {
      if (!autoPlay) return;
      video.play().catch(() => {
        // Autoplay may be blocked until interaction; keep muted + loop ready
      });
    };

    tryPlay();
    video.addEventListener("loadeddata", tryPlay);

    const onEnded = () => {
      video.currentTime = 0;
      video.play().catch(() => {});
    };
    video.addEventListener("ended", onEnded);

    return () => {
      video.removeEventListener("loadeddata", tryPlay);
      video.removeEventListener("ended", onEnded);
    };
  }, [src, autoPlay]);

  return (
    <video
      ref={ref}
      className={className}
      muted
      loop
      playsInline
      autoPlay={autoPlay}
      preload={autoPlay ? "auto" : "metadata"}
      poster={posterUrl ?? undefined}
      aria-label={alt}
    >
      <source
        src={src}
        type={src.endsWith(".webm") ? "video/webm" : "video/mp4"}
      />
    </video>
  );
}

/**
 * Renders image / video / SVG from /public/assets.
 * Callers should size the frame (e.g. className="absolute inset-0").
 */
export function Media({
  src,
  alt,
  mediaType,
  posterUrl,
  className = "",
  imgClassName = "object-cover",
  priority = false,
  sizes = "100vw",
  fill = true,
  width,
  height,
  fallbackGradient = "radial-gradient(120% 120% at 50% 10%, #7B4BB4, #4E2A7A 55%, #2b1a4d)",
  autoPlay = false,
}: MediaProps) {
  if (!src) {
    return (
      <Placeholder
        className={className}
        fallbackGradient={fallbackGradient}
        alt={alt}
      />
    );
  }

  const kind = mediaType ?? mediaTypeFromUrl(src);

  if (kind === "video") {
    return (
      <div className={`overflow-hidden ${className}`}>
        <LoopingVideo
          src={src}
          alt={alt}
          posterUrl={posterUrl}
          autoPlay={autoPlay}
          className={`absolute inset-0 h-full w-full ${imgClassName}`}
        />
      </div>
    );
  }

  if (kind === "svg") {
    return (
      <div className={`overflow-hidden ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className={
            fill
              ? `absolute inset-0 h-full w-full ${imgClassName}`
              : imgClassName
          }
          loading={priority ? "eager" : "lazy"}
          decoding="async"
        />
      </div>
    );
  }

  if (fill) {
    return (
      <div className={`overflow-hidden ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className={`absolute inset-0 h-full w-full ${imgClassName}`}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
        />
      </div>
    );
  }

  return (
    <div className={`overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={width ?? 800}
        height={height ?? 1000}
        sizes={sizes}
        priority={priority}
        className={imgClassName}
      />
    </div>
  );
}
