export const LOCALE_STORAGE_KEY = "al-athaq-locale";

export type LocaleCode =
  | "en"
  | "ar"
  | "zh-Hans"
  | "zh-Hant"
  | "ja"
  | "tl"
  | "fr"
  | "es"
  | "de"
  | "tr"
  | "hi";

export type LocaleMeta = {
  code: LocaleCode;
  label: string;
  nativeLabel: string;
  short: string;
  dir: "ltr" | "rtl";
};

export const LOCALES: LocaleMeta[] = [
  {
    code: "en",
    label: "English",
    nativeLabel: "English",
    short: "EN",
    dir: "ltr",
  },
  {
    code: "ar",
    label: "Arabic",
    nativeLabel: "العربية",
    short: "ع",
    dir: "rtl",
  },
  {
    code: "zh-Hans",
    label: "Chinese (Mandarin)",
    nativeLabel: "普通话",
    short: "普",
    dir: "ltr",
  },
  {
    code: "zh-Hant",
    label: "Chinese (Cantonese)",
    nativeLabel: "廣東話",
    short: "粵",
    dir: "ltr",
  },
  {
    code: "ja",
    label: "Japanese",
    nativeLabel: "日本語",
    short: "JP",
    dir: "ltr",
  },
  {
    code: "tl",
    label: "Tagalog",
    nativeLabel: "Tagalog",
    short: "TL",
    dir: "ltr",
  },
  {
    code: "fr",
    label: "French",
    nativeLabel: "Français",
    short: "FR",
    dir: "ltr",
  },
  {
    code: "es",
    label: "Spanish",
    nativeLabel: "Español",
    short: "ES",
    dir: "ltr",
  },
  {
    code: "de",
    label: "German",
    nativeLabel: "Deutsch",
    short: "DE",
    dir: "ltr",
  },
  {
    code: "tr",
    label: "Turkish",
    nativeLabel: "Türkçe",
    short: "TR",
    dir: "ltr",
  },
  {
    code: "hi",
    label: "Hindi",
    nativeLabel: "हिन्दी",
    short: "HI",
    dir: "ltr",
  },
];

export const DEFAULT_LOCALE: LocaleCode = "en";

export function isLocaleCode(value: string): value is LocaleCode {
  return LOCALES.some((l) => l.code === value);
}

export function getLocaleMeta(code: LocaleCode): LocaleMeta {
  return LOCALES.find((l) => l.code === code) ?? LOCALES[0];
}
