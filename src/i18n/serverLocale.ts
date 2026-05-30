import { cookies } from "next/headers";
import { translations, type Locale, type TranslationKeys } from "./translations";

export async function getServerTranslations(): Promise<{ locale: Locale; t: TranslationKeys }> {
  const cookieStore = await cookies();
  const saved = cookieStore.get("locale")?.value;
  const locale: Locale = saved === "pt" ? "pt" : "en";
  return { locale, t: translations[locale] as unknown as TranslationKeys };
}
