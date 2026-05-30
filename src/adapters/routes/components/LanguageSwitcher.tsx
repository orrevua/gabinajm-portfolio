"use client";

import { useTranslation } from "@/src/i18n";
import type { Locale } from "@/src/i18n";

export function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();

  return (
    <div className="flex items-center gap-2 bg-white rounded-pill px-4 py-2 shadow-[0_8px_16px_-10px_rgba(0,0,0,0.25)]">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-accent flex-shrink-0">
        <circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
      <div className="flex gap-1">
        {(["en", "pt"] as Locale[]).map((l) => (
          <button
            key={l}
            onClick={() => setLocale(l)}
            className={`px-3 py-1 rounded-pill text-sm transition-all ${
              locale === l
                ? "bg-gradient-to-r from-accent to-accent-purple text-white font-bold"
                : "text-[#0A0A0A]/60 font-medium hover:text-[#0A0A0A] hover:bg-[#E1E1E1]/50"
            }`}
            aria-label={l === "en" ? "English" : "Português"}
            aria-pressed={locale === l}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
