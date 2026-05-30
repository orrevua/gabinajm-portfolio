"use client";

import Link from "next/link";
import { useTranslation } from "@/src/i18n";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <h1 className="text-display font-serif font-bold text-[#0A0A0A] mb-4">
          {t.error.oops}
        </h1>
        <p className="text-muted uppercase tracking-widest text-sm mb-8">
          {t.error.somethingWentWrong}
        </p>

        {process.env.NODE_ENV === "development" && error.message && (
          <div className="mb-8 p-6 border border-border text-left">
            <p className="text-sm font-mono text-[#0A0A0A]/70">{error.message}</p>
            {error.digest && (
              <p className="text-xs text-muted mt-2">{t.error.errorId} {error.digest}</p>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <button
            onClick={reset}
            className="text-[#0A0A0A] uppercase tracking-widest text-sm font-semibold border-b-2 border-foreground pb-1 hover:text-muted hover:border-muted transition-colors"
          >
            {t.error.tryAgainAction}
          </button>
          <Link
            href="/"
            className="text-muted uppercase tracking-widest text-sm font-semibold border-b-2 border-muted pb-1 hover:text-[#0A0A0A] hover:border-foreground transition-colors"
          >
            {t.error.backToHome}
          </Link>
        </div>
      </div>
    </div>
  );
}

ErrorPage.displayName = "ErrorPage";
