"use client";

import { useTranslation } from "@/src/i18n";

interface ValueItem {
  title: string;
  description: string;
}

export interface ValuesSectionProps {
  heading?: string | null;
  values?: ValueItem[];
}

export function ValuesSection({ heading, values }: ValuesSectionProps) {
  const { t } = useTranslation();

  const displayHeading = heading || t.about.valuesHeading;
  const displayValues = values && values.length > 0
    ? values
    : t.about.values.map((v) => ({ title: v.title, description: v.body }));

  return (
    <div className="py-16 md:py-20">
      <h2 className="text-heading font-extrabold text-[#0A0A0A] mb-8">{displayHeading}</h2>
      <div className="flex flex-col gap-6">
        {displayValues.map((v, i) => (
          <div
            key={i}
            className="rounded-2xl p-8 md:p-10 bg-gradient-to-r from-[#ffffff] via-[#fdf2f8] to-[#fdf2f8] drop-shadow-xl"
          >
            <div className="flex gap-6 items-center">
              <span className="text-[40px] font-bold leading-none bg-gradient-to-b from-accent via-accent to-accent-purple inline-block bg-clip-text text-transparent shrink-0 tabular-nums">
                {i + 1}
              </span>
              <div>
                <h3 className="text-xl font-bold text-[#0A0A0A] mb-3">{v.title}</h3>
                <p className="text-base text-[#0A0A0A]/60 leading-relaxed">{v.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
