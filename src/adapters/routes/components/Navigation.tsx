"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/src/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";

export interface NavigationProps {
  brandName?: string;
  resumeUrl?: string | null;
  pastExperience?: Array<{ name: string; logo: { url: string; alt: string } }>;
}

export const Navigation: React.FC<NavigationProps> = ({
  brandName = "Gabinajm",
  resumeUrl,
  pastExperience = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useTranslation();

  const links = [
    { href: "/", label: t.nav.home },
    { href: "/about", label: t.nav.about },
  ];
  const ctaLink = { href: "#contact", label: t.nav.contact };

  // eslint-disable-next-line react-hooks/set-state-in-effect -- close mobile menu on route change
  useEffect(() => { setIsOpen(false); }, [pathname]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const isActive = (href: string) => pathname === href;

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-surface backdrop-blur-md"
      style={{ WebkitBackdropFilter: "blur(7.5px)" }}
      aria-label="Main navigation"
    >
      <div className="max-w-[1158px] mx-auto h-[72px] md:h-[80px] px-6 md:px-8 flex justify-between items-center">
        <Link
          href="/"
          className="relative z-[2] flex items-center"
          aria-label={`${brandName} home`}
        >
          <img
            src="/images/nav_logo.svg"
            alt={`${brandName} logo`}
            width={161}
            height={40}
            className="h-10 w-auto"
          />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-semibold transition-colors ${
                isActive(link.href)
                  ? "text-[#0A0A0A]"
                  : "text-[#0A0A0A]/70 hover:text-accent"
              }`}
              aria-current={isActive(link.href) ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={ctaLink.href}
            className="px-5 py-2.5 rounded-pill bg-gradient-to-r from-accent to-accent-purple text-white text-sm font-semibold hover:shadow-[0_0_20px_rgba(246,51,154,0.2)] transition-shadow duration-300"
          >
            {ctaLink.label}
          </Link>
          <LanguageSwitcher />
        </div>

        <button
          className="md:hidden text-[#0A0A0A] hover:text-accent-pink focus:outline-none transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Toggle navigation menu"
        >
          <span className="uppercase text-xs tracking-widest font-semibold">
            {isOpen ? t.nav.close : t.nav.menu}
          </span>
        </button>
      </div>

      {isOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-0 bg-background z-40 flex flex-col items-center justify-center space-y-10 md:hidden animate-fade-in"
          role="region"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-3xl font-bold transition-colors ${
                isActive(link.href) ? "text-accent-pink" : "text-[#0A0A0A] hover:text-accent-pink"
              }`}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={ctaLink.href}
            className="px-8 py-3 rounded-pill bg-gradient-to-r from-accent to-accent-purple text-white text-xl font-bold hover:opacity-90 transition-opacity"
            onClick={() => setIsOpen(false)}
          >
            {ctaLink.label}
          </Link>

          {resumeUrl && (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-semibold text-[#0A0A0A]/70 hover:text-accent-pink transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {t.about.resume}
            </a>
          )}

          {pastExperience.length > 0 && (
            <div className="flex items-center gap-6 pt-4">
              {pastExperience.map((company) => (
                <img
                  key={company.name}
                  src={company.logo.url}
                  alt={company.name}
                  className="h-8 w-auto opacity-40 grayscale"
                />
              ))}
            </div>
          )}

          <LanguageSwitcher />
        </div>
      )}
    </nav>
  );
};

Navigation.displayName = "Navigation";
