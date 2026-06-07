"use client";

import Link from "next/link";
import { useTranslation } from "@/src/i18n";

export function NextProjectCard({ title, description, slug }: { title: string; description: string; slug: string }) {
  const { t } = useTranslation();

  return (
    <div className="max-w-[1158px] mx-auto px-5 py-8">
      <div className="relative overflow-hidden rounded-3xl bg-[#9810FA] px-10 py-12 md:px-14 md:py-14">
        <div className="absolute -top-20 -right-20 w-[340px] h-[340px] rounded-full bg-white/10 pointer-events-none" />
        <div className="relative z-10">
          <p className="text-base font-bold text-white/80 mb-3">{t.projects.nextProject}</p>
          <h3 className="text-[clamp(20px,2.5vw,24px)] font-bold text-white mb-2">{title}</h3>
          <p className="text-base md:text-lg text-white/80 mb-8">{description}</p>
          <Link
            href={`/projects/${slug}`}
            className="inline-flex items-center gap-2 bg-white text-accent-purple font-bold text-base px-8 py-3 rounded-pill hover:opacity-90 transition-opacity"
          >
            {t.projects.viewProject}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
