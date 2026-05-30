"use client";

import { useTranslation } from "@/src/i18n";

export function TranslatedHeading({
  path,
  className,
}: {
  path: string;
  className?: string;
}) {
  const { t } = useTranslation();
  const keys = path.split(".");
  let value: unknown = t;
  for (const k of keys) value = (value as Record<string, unknown>)[k];
  return <h2 className={className}>{value as string}</h2>;
}
