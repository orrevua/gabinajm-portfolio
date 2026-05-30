"use client";

import { useTranslation } from "@/src/i18n";

export function ValuesSection() {
  const { t } = useTranslation();

  return (
    <div className="py-16 md:py-20">
      <h2 className="text-heading font-extrabold text-[#0A0A0A] mb-8">{t.about.valuesHeading}</h2>
      <div className="flex flex-col gap-6">
        {t.about.values.map((v, i) => (
          <div
            key={i}
            className="rounded-2xl p-8 md:p-10 bg-gradient-to-r from-[#ffffff] via-[#fdf2f8] to-[#fdf2f8] shadow-[0_4px_24px_rgba(0,0,0,0.08),0_1px_4px_rgba(0,0,0,0.05)]"
          >
            <div className="flex gap-6 items-start">
              <span className="text-[40px] md:text-[48px] font-bold leading-none bg-gradient-to-b from-accent via-accent to-accent-purple inline-block bg-clip-text text-transparent shrink-0 tabular-nums">
                {i + 1}
              </span>
              <div className="pt-1">
                <h3 className="text-xl md:text-2xl font-bold text-[#0A0A0A] mb-3">{v.title}</h3>
                <p className="text-base text-[#0A0A0A]/60 leading-relaxed">{v.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
