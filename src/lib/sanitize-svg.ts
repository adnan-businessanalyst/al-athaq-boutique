import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitize SVG markup before any inline rendering to prevent XSS.
 * Prefer <img src="...svg"> for public assets; use this only when inline SVG is required.
 */
export function sanitizeSvg(svg: string): string {
  return DOMPurify.sanitize(svg, {
    USE_PROFILES: { svg: true, svgFilters: true },
    ADD_TAGS: ["use"],
  });
}
