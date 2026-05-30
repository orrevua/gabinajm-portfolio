import Link from "next/link";
import { getServerTranslations } from "@/src/i18n/serverLocale";

export default async function NotFoundPage() {
  const { t } = await getServerTranslations();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="text-display font-serif font-bold text-[#0A0A0A] mb-4">
          404
        </div>
        <p className="text-muted uppercase tracking-widest text-sm mb-12">
          {t.error.pageNotFound}
        </p>

        <Link
          href="/"
          className="text-[#0A0A0A] uppercase tracking-widest text-sm font-semibold border-b-2 border-foreground pb-1 hover:text-muted hover:border-muted transition-colors"
        >
          {t.error.backToHome}
        </Link>
      </div>
    </div>
  );
}

NotFoundPage.displayName = "NotFoundPage";
