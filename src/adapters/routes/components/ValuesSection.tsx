"use client";

import { useTranslation } from "@/src/i18n";

export function ValuesSection() {
  const { t } = useTranslation();

  return (
    <div className="py-16 md:py-20">
      <h2 className="text-heading font-extrabold text-[#0A0A0A] mb-10">{t.about.valuesHeading}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {t.about.values.map((v, i) => (
          <div key={i} className="flex flex-col gap-3">
            <span className="text-[40px] font-bold text-accent leading-none">{i + 1}</span>
            <h3 className="text-xl font-bold text-[#0A0A0A]">{v.title}</h3>
            <p className="text-base text-[#0A0A0A]/70 leading-relaxed">{v.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
