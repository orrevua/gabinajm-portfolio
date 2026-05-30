"use client";

import { useTranslation } from "@/src/i18n";

export function TranslatedFooter() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="container-max py-10 flex flex-col items-center gap-1 text-sm text-muted">
      <p>{t.footer.copyright.replace("{year}", String(year))}</p>
      <p>{t.footer.tagline}</p>
    </footer>
  );
}
