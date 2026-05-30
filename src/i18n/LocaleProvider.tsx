"use client";

import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { translations, type Locale, type TranslationKeys } from "./translations";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationKeys;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return match ? decodeURIComponent(match[1]) : undefined;
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = name + "=" + encodeURIComponent(value) + ";expires=" + expires + ";path=/;SameSite=Lax";
}

export function LocaleProvider({ children, initialLocale }: { children: ReactNode; initialLocale?: Locale }) {
  const router = useRouter();
  const [locale, setLocaleState] = useState<Locale>(initialLocale ?? (() => {
    const saved = getCookie("locale");
    return saved === "pt" ? "pt" : "en";
  }));

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    setCookie("locale", l, 365);
    router.refresh();
  }, [router]);

  const value = useMemo(() => ({
    locale,
    setLocale,
    t: translations[locale] as unknown as TranslationKeys,
  }), [locale, setLocale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useTranslation() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useTranslation must be used within LocaleProvider");
  return ctx;
}
