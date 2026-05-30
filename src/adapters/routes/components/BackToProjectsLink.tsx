"use client";

import Link from "next/link";
import { useTranslation } from "@/src/i18n";

export function BackToProjectsLink() {
  const { t } = useTranslation();

  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 text-sm font-medium text-[#0A0A0A]/70 hover:text-[#0A0A0A] transition-colors mb-10"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
      </svg>
      {t.projects.backToProjects}
    </Link>
  );
}
