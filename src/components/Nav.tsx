"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/components/LanguageProvider";

export function Nav() {
  const { dict } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const drawerId = useId();
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  const links = [
    { href: "#featured", label: dict.nav.featured },
    { href: "#our-story", label: dict.nav.ourStory },
    { href: "#products", label: dict.nav.products },
  ] as const;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuBtnRef.current?.focus();
      }
      if (e.key === "Tab" && drawerRef.current) {
        const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const barTone = scrolled
    ? "bg-[rgba(251,245,236,0.85)] text-athaq-ink shadow-[0_8px_30px_rgba(42,35,32,0.08)] backdrop-blur-md"
    : "bg-transparent text-athaq-cream shadow-none";

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
      <nav
        aria-label="Primary"
        className={`mx-auto flex w-full max-w-content items-center justify-between gap-2 rounded-pill border border-white/10 px-3 py-2.5 transition-all duration-nav sm:px-5 ${barTone}`}
      >
        <Link
          href="/"
          className="group inline-flex min-h-11 items-center rounded-pill focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-athaq-teal"
          aria-label="Al Athaq Boutique home"
        >
          <BrandLogo size="nav" className="shadow-sm ring-1 ring-white/10" />
        </Link>

        <div className="hidden items-center gap-1 md:flex lg:gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex min-h-11 items-center rounded-pill px-3 text-sm font-medium tracking-wide transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-athaq-teal lg:px-4"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="#featured"
            className="ms-1 inline-flex min-h-11 items-center rounded-pill bg-athaq-teal px-5 text-sm font-semibold text-white transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-athaq-teal"
          >
            {dict.nav.discover}
          </Link>
          <LanguageSwitcher tone={scrolled ? "light" : "dark"} className="ms-1" />
        </div>

        <div className="flex items-center gap-1.5 md:hidden">
          <LanguageSwitcher tone={scrolled ? "light" : "dark"} />
          <button
            ref={menuBtnRef}
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-pill focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-athaq-teal"
            aria-expanded={open}
            aria-controls={drawerId}
            aria-label={open ? dict.nav.closeMenu : dict.nav.menu}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <span className="flex w-5 flex-col gap-1.5" aria-hidden="true">
              <span
                className={`block h-0.5 w-full bg-current transition ${open ? "translate-y-2 rotate-45" : ""}`}
              />
              <span
                className={`block h-0.5 w-full bg-current transition ${open ? "opacity-0" : ""}`}
              />
              <span
                className={`block h-0.5 w-full bg-current transition ${open ? "-translate-y-2 -rotate-45" : ""}`}
              />
            </span>
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-40 md:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        <button
          type="button"
          className={`absolute inset-0 bg-athaq-ink/40 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
          aria-label={dict.nav.closeMenu}
          tabIndex={open ? 0 : -1}
          onClick={() => setOpen(false)}
        />
        <div
          ref={drawerRef}
          id={drawerId}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className={`absolute inset-x-3 top-[4.5rem] rounded-3xl border border-athaq-purple/10 bg-athaq-cream p-5 shadow-xl transition-all duration-300 ${
            open ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
          }`}
        >
          <div className="mb-3 flex justify-end">
            <button
              ref={closeBtnRef}
              type="button"
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-pill text-athaq-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-athaq-teal"
              aria-label={dict.nav.closeMenu}
              onClick={() => {
                setOpen(false);
                menuBtnRef.current?.focus();
              }}
            >
              ✕
            </button>
          </div>
          <ul className="flex flex-col gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex min-h-11 items-center rounded-pill px-4 font-medium text-athaq-ink hover:bg-athaq-purple/5"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link
                href="#featured"
                className="flex min-h-11 items-center justify-center rounded-pill bg-athaq-teal px-5 font-semibold text-white"
                onClick={() => setOpen(false)}
              >
                {dict.nav.discover}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
