"use client";

import Link from "next/link";
import { useTranslation } from "@/src/i18n";

export function NextProjectCard({ title, description, slug }: { title: string; description: string; slug: string }) {
  const { t } = useTranslation();

  return (
    <div className="max-w-[1158px] mx-auto px-5 py-16 border-t border-border">
      <p className="text-base font-bold text-[#0A0A0A] mb-4">{t.projects.nextProject}</p>
      <h3 className="text-[clamp(24px,3vw,30px)] font-bold text-[#0A0A0A] mb-2">{title}</h3>
      <p className="text-lg text-[#0A0A0A]/70 mb-6">{description}</p>
      <Link
        href={`/projects/${slug}`}
        className="inline-flex items-center gap-2 text-base font-bold text-[#0A0A0A] hover:text-accent transition-colors"
      >
        {t.projects.viewProject}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
        </svg>
      </Link>
    </div>
  );
}
