type DiamondMotifProps = {
  className?: string;
  size?: number;
  tone?: "light" | "dark" | "purple";
};

const fills = {
  light: "rgba(251,245,236,0.35)",
  dark: "rgba(42,35,32,0.18)",
  purple: "rgba(108,63,164,0.28)",
};

export function DiamondMotif({
  className = "",
  size = 48,
  tone = "purple",
}: DiamondMotifProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      aria-hidden="true"
      className={className}
    >
      <rect
        x="24"
        y="4"
        width="28"
        height="28"
        rx="2"
        transform="rotate(45 24 4)"
        fill="none"
        stroke={fills[tone]}
        strokeWidth="1.5"
      />
      <rect
        x="24"
        y="12"
        width="16"
        height="16"
        rx="1"
        transform="rotate(45 24 12)"
        fill={fills[tone]}
      />
    </svg>
  );
}

export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`relative inline-flex h-9 w-9 items-center justify-center ${className}`}
      aria-hidden="true"
    >
      <span className="absolute inset-[3px] rotate-45 rounded-[5px] border-2 border-current opacity-90" />
      <span className="relative z-10 font-display text-[0.95rem] font-normal leading-none tracking-wide">
        A
      </span>
    </span>
  );
}
