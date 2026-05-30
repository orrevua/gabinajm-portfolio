"use client";

import { useTranslation } from "@/src/i18n";

export function SkipToContent() {
  const { t } = useTranslation();

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-pill focus:bg-foreground focus:text-background focus:text-sm focus:font-semibold"
    >
      {t.accessibility.skipToContent}
    </a>
  );
}
