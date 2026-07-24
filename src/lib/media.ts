import { existsSync } from "fs";
import path from "path";
import type { MediaKind } from "@/types";
import {
  EXT_TO_KIND,
  MEDIA_EXTENSIONS,
  mediaTypeFromUrl,
} from "@/lib/media-utils";

export {
  getExtension,
  mediaTypeFromUrl,
  mediaTypeFromMime,
  isRemoteUrl,
  MEDIA_EXTENSIONS,
} from "@/lib/media-utils";

const ASSETS_SUBDIR = "assets";

/**
 * Resolve a site asset by basename from /public/assets (preferred),
 * accepting any popular web format. Falls back to /public root.
 */
export function resolvePublicMedia(
  basename: string,
  preferredExt = "png",
): { mediaUrl: string; mediaType: MediaKind } | null {
  const publicDir = path.join(process.cwd(), "public");
  const searchRoots = [
    { disk: path.join(publicDir, ASSETS_SUBDIR), urlPrefix: `/${ASSETS_SUBDIR}` },
    { disk: publicDir, urlPrefix: "" },
  ];

  const ordered = [
    // Prefer video when both image + video exist for the same basename
    ...MEDIA_EXTENSIONS.video,
    ...MEDIA_EXTENSIONS.svg,
    preferredExt,
    ...MEDIA_EXTENSIONS.image.filter((e) => e !== preferredExt),
  ];
  // de-dupe while preserving order
  const seen = new Set<string>();
  const uniqueOrdered = ordered.filter((ext) => {
    if (seen.has(ext)) return false;
    seen.add(ext);
    return true;
  });

  for (const root of searchRoots) {
    for (const ext of uniqueOrdered) {
      const filename = `${basename}.${ext}`;
      const diskPath = path.join(root.disk, filename);
      if (existsSync(diskPath)) {
        return {
          mediaUrl: `${root.urlPrefix}/${filename}`,
          mediaType: EXT_TO_KIND[ext] ?? "image",
        };
      }
    }

    if (basename.includes(".")) {
      const diskPath = path.join(root.disk, basename);
      if (existsSync(diskPath)) {
        return {
          mediaUrl: `${root.urlPrefix}/${basename}`,
          mediaType: mediaTypeFromUrl(basename),
        };
      }
    }
  }

  return null;
}

export function resolveOrFallback(
  basename: string,
  preferredExt = "png",
): { mediaUrl: string | null; mediaType: MediaKind } {
  const resolved = resolvePublicMedia(basename, preferredExt);
  if (resolved) return resolved;
  return { mediaUrl: null, mediaType: "image" };
}
