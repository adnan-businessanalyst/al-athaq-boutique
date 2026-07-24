type BrandLogoProps = {
  className?: string;
  /** Visual size preset for nav vs footer */
  size?: "nav" | "footer";
};

/**
 * Official Al Athaq Boutique logo mark from /public/assets/logo.png
 */
export function BrandLogo({ className = "", size = "nav" }: BrandLogoProps) {
  const sizeClass =
    size === "footer"
      ? "h-16 w-16 sm:h-20 sm:w-20"
      : "h-9 w-9 sm:h-10 sm:w-10";

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/assets/logo.png"
      alt="Al Athaq Boutique"
      width={160}
      height={160}
      className={`rounded-lg object-cover ${sizeClass} ${className}`}
      decoding="async"
    />
  );
}
