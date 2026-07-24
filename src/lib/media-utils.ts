import type { MediaKind } from "@/types";

const IMAGE_EXTS = ["png", "jpg", "jpeg", "webp", "gif", "avif", "bmp"] as const;
const VIDEO_EXTS = ["mp4", "webm", "ogg", "mov"] as const;
const SVG_EXTS = ["svg"] as const;

export const MEDIA_EXTENSIONS = {
  image: IMAGE_EXTS,
  video: VIDEO_EXTS,
  svg: SVG_EXTS,
  all: [...VIDEO_EXTS, ...SVG_EXTS, ...IMAGE_EXTS] as const,
};

export const EXT_TO_KIND: Record<string, MediaKind> = {
  ...Object.fromEntries(IMAGE_EXTS.map((e) => [e, "image" as const])),
  ...Object.fromEntries(VIDEO_EXTS.map((e) => [e, "video" as const])),
  ...Object.fromEntries(SVG_EXTS.map((e) => [e, "svg" as const])),
};

export function getExtension(url: string): string {
  const clean = url.split("?")[0]?.split("#")[0] ?? url;
  const base = clean.split("/").pop() ?? "";
  const dot = base.lastIndexOf(".");
  if (dot < 0) return "";
  return base.slice(dot + 1).toLowerCase();
}

export function mediaTypeFromUrl(url: string): MediaKind {
  const ext = getExtension(url);
  return EXT_TO_KIND[ext] ?? "image";
}

export function mediaTypeFromMime(mime: string): MediaKind {
  const m = mime.toLowerCase();
  if (m === "image/svg+xml") return "svg";
  if (m.startsWith("video/")) return "video";
  return "image";
}

export function isRemoteUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}
