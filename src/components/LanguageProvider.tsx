"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getDictionary, type Dictionary } from "@/lib/i18n/dictionaries";
import {
  DEFAULT_LOCALE,
  getLocaleMeta,
  isLocaleCode,
  LOCALE_STORAGE_KEY,
  type LocaleCode,
  type LocaleMeta,
} from "@/lib/i18n/locales";

type LanguageContextValue = {
  locale: LocaleCode;
  meta: LocaleMeta;
  dict: Dictionary;
  setLocale: (code: LocaleCode) => void;
  dir: "ltr" | "rtl";
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<LocaleCode>(DEFAULT_LOCALE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored && isLocaleCode(stored)) {
      setLocaleState(stored);
    }
    setReady(true);
  }, []);

  const setLocale = useCallback((code: LocaleCode) => {
    setLocaleState(code);
    window.localStorage.setItem(LOCALE_STORAGE_KEY, code);
  }, []);

  const meta = getLocaleMeta(locale);
  const dict = useMemo(() => getDictionary(locale), [locale]);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = locale;
    root.dir = meta.dir;
    root.dataset.locale = locale;
  }, [locale, meta.dir]);

  const value = useMemo(
    () => ({
      locale,
      meta,
      dict,
      setLocale,
      dir: meta.dir,
    }),
    [locale, meta, dict, setLocale],
  );

  return (
    <LanguageContext.Provider value={value}>
      <div
        className={ready ? "opacity-100 transition-opacity duration-300" : "opacity-100"}
        lang={locale}
        dir={meta.dir}
      >
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}
