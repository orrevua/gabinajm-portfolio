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
    <>
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
      </nav>

      {isOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-[60] flex flex-col md:hidden animate-fade-in"
          style={{ background: "linear-gradient(180deg, #FDF2F8 0%, #FAF5FF 50%, #EFF6FF 100%)" }}
          role="region"
        >
          <div className="flex justify-between items-center px-6 pt-5">
            <LanguageSwitcher />
            <button
              onClick={() => setIsOpen(false)}
              aria-label={t.nav.close}
              className="text-[#0A0A0A] hover:text-accent-pink transition-colors p-1"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center gap-10">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-2xl font-bold transition-colors ${
                  isActive(link.href)
                    ? "bg-gradient-to-r from-accent to-accent-purple bg-clip-text text-transparent"
                    : "text-[#0A0A0A] hover:text-accent-pink"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={ctaLink.href}
              className={`text-2xl font-bold transition-colors ${
                pathname.includes("#contact")
                  ? "bg-gradient-to-r from-accent to-accent-purple bg-clip-text text-transparent"
                  : "text-[#0A0A0A] hover:text-accent-pink"
              }`}
              onClick={() => setIsOpen(false)}
            >
              {ctaLink.label}
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

Navigation.displayName = "Navigation";
