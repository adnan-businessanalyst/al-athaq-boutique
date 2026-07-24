"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { LOCALES, type LocaleCode } from "@/lib/i18n/locales";

function GlobeIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M3.5 12h17M12 3.5c2.5 2.8 3.8 5.6 3.8 8.5S14.5 17.7 12 20.5C9.5 17.7 8.2 14.9 8.2 12S9.5 6.3 12 3.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type LanguageSwitcherProps = {
  tone?: "light" | "dark";
  className?: string;
};

export function LanguageSwitcher({
  tone = "light",
  className = "",
}: LanguageSwitcherProps) {
  const { locale, meta, setLocale, dict } = useLanguage();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onPointer = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const onSelect = (code: LocaleCode) => {
    setLocale(code);
    setOpen(false);
  };

  const isDark = tone === "dark";
  const triggerClass = isDark
    ? "border-white/20 bg-white/10 text-athaq-cream hover:bg-white/15"
    : "border-athaq-ink/10 bg-athaq-cream/90 text-athaq-ink hover:bg-white";

  return (
    <div ref={rootRef} className={`relative z-[60] ${className}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={dict.nav.language}
        onClick={() => setOpen((v) => !v)}
        className={`group relative inline-flex min-h-11 items-center gap-2 overflow-hidden rounded-pill border px-3.5 py-2 text-sm font-semibold shadow-[0_8px_24px_rgba(42,35,32,0.08)] backdrop-blur-md transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-athaq-teal ${triggerClass} ${
          open ? "scale-[1.03] ring-2 ring-athaq-teal/35" : "hover:scale-[1.02]"
        }`}
      >
        <span
          className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${
            isDark
              ? "bg-[radial-gradient(120%_80%_at_0%_0%,rgba(23,140,134,0.35),transparent_55%)]"
              : "bg-[radial-gradient(120%_80%_at_0%_0%,rgba(108,63,164,0.14),transparent_55%)]"
          }`}
          aria-hidden="true"
        />
        <GlobeIcon
          className={`relative h-4 w-4 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            open ? "rotate-[360deg] scale-110 text-athaq-teal" : "group-hover:rotate-45"
          }`}
        />
        <span className="relative tracking-[0.14em]">{meta.short}</span>
        <span
          className={`relative inline-block text-[0.65rem] transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        >
          ▾
        </span>
      </button>

      <div
        className={`absolute end-0 top-[calc(100%+0.65rem)] w-[min(18.5rem,calc(100vw-1.5rem))] origin-top-right transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-2 scale-95 opacity-0"
        }`}
      >
        <div
          id={listId}
          role="listbox"
          aria-label={dict.nav.language}
          className="overflow-hidden rounded-3xl border border-athaq-teal/25 bg-athaq-teal/65 shadow-[0_24px_60px_rgba(23,140,134,0.18)] backdrop-blur-xl"
        >
          <div className="relative border-b border-white/20 px-4 py-3">
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_120%_at_100%_0%,rgba(251,245,236,0.18),transparent_60%)]"
              aria-hidden="true"
            />
            <p className="relative text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-athaq-cream/80">
              {dict.nav.language}
            </p>
            <p className="relative mt-1 font-display text-lg text-athaq-cream">
              {meta.nativeLabel}
            </p>
          </div>

          <ul className="max-h-[min(22rem,55vh)] overflow-y-auto p-2">
            {LOCALES.map((item, index) => {
              const selected = item.code === locale;
              return (
                <li
                  key={item.code}
                  style={
                    mounted && open
                      ? {
                          animation: `lang-item-in 0.45s cubic-bezier(0.22, 1, 0.36, 1) ${index * 35}ms both`,
                        }
                      : undefined
                  }
                >
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => onSelect(item.code)}
                    className={`group/item flex w-full min-h-11 items-center gap-3 rounded-2xl px-3 py-2.5 text-start transition-all duration-300 ${
                      selected
                        ? "bg-athaq-cream/20 text-athaq-cream shadow-md ring-1 ring-white/25"
                        : "text-athaq-cream/90 hover:bg-white/10"
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-xs font-bold tracking-wide transition-transform duration-300 group-hover/item:scale-105 ${
                        selected
                          ? "border-white/50 bg-athaq-cream text-athaq-teal"
                          : "border-white/30 bg-white/10 text-athaq-cream"
                      }`}
                    >
                      {item.short}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium leading-tight">
                        {item.nativeLabel}
                      </span>
                      <span
                        className={`block truncate text-xs ${
                          selected ? "text-athaq-cream/80" : "text-athaq-cream/65"
                        }`}
                      >
                        {item.label}
                      </span>
                    </span>
                    <span
                      className={`grid h-5 w-5 place-items-center rounded-full transition-all duration-300 ${
                        selected
                          ? "scale-100 bg-athaq-cream text-[0.65rem] text-athaq-teal opacity-100"
                          : "scale-75 opacity-0"
                      }`}
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
