"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/src/i18n";

function Toast({ type, onDismiss, successMsg, errorMsg }: { type: "sent" | "error"; onDismiss: () => void; successMsg: string; errorMsg: string }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const isSent = type === "sent";
  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 rounded-pill shadow-lg text-white text-base font-medium animate-fade-in ${isSent ? "bg-[#16A34A]" : "bg-[#DC2626]"}`}
      role="alert"
    >
      {isSent ? (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ) : (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      )}
      {isSent ? successMsg : errorMsg}
    </div>
  );
}

export interface ContactSectionProps {
  heading?: string;
  subtitle?: string;
  email?: string;
  socialLinks?: Array<{ platform: string; url: string }>;
  availabilityText?: string;
}

const PLATFORM_COLORS: Record<string, string> = {
  email: "bg-accent",
  linkedin: "bg-[#0077B5]",
  instagram: "bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#dc2743]",
  github: "bg-foreground",
  twitter: "bg-[#1DA1F2]",
};

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  email: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-10 6L2 7" />
    </svg>
  ),
  linkedin: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  instagram: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
};

function getPlatformHandle(url: string, platform: string): string {
  if (platform === "email") return url.replace("mailto:", "");
  try {
    const u = new URL(url);
    const path = u.pathname.replace(/^\//, "").replace(/\/$/, "");
    return path ? `@${path}` : url;
  } catch {
    return url;
  }
}

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-muted">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

export const ContactSection: React.FC<ContactSectionProps> = ({
  heading,
  subtitle,
  email,
  socialLinks = [],
  availabilityText,
}) => {
  const { t } = useTranslation();
  const displayHeading = heading || t.contact.heading;
  const displaySubtitle = subtitle || t.contact.subtitle;
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("sent");
        setFormData({ name: "", email: "", message: "" });
      } else {
        const data = await res.json();
        console.error("Contact form error:", data.error);
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="container-max py-16 md:py-24" aria-label={displayHeading} id="contact">
      <h2 className="text-heading font-extrabold text-[#0A0A0A] mb-2">
        {displayHeading}
      </h2>
      <p className="text-base text-muted mb-10">
        {displaySubtitle}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="contact-name" className="block text-sm font-semibold text-[#0A0A0A] mb-2">
              {t.contact.nameLabel}
            </label>
            <input
              id="contact-name"
              type="text"
              placeholder={t.contact.namePlaceholder}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3.5 rounded-2xl border border-border bg-white text-[#0A0A0A] placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
              required
            />
          </div>

          <div>
            <label htmlFor="contact-email" className="block text-sm font-semibold text-[#0A0A0A] mb-2">
              {t.contact.emailLabel}
            </label>
            <input
              id="contact-email"
              type="email"
              placeholder={t.contact.emailPlaceholder}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3.5 rounded-2xl border border-border bg-white text-[#0A0A0A] placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
              required
            />
          </div>

          <div>
            <label htmlFor="contact-message" className="block text-sm font-semibold text-[#0A0A0A] mb-2">
              {t.contact.messageLabel}
            </label>
            <textarea
              id="contact-message"
              placeholder={t.contact.messagePlaceholder}
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-3.5 rounded-2xl border border-border bg-white text-[#0A0A0A] placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors resize-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={status === "sending" || status === "sent"}
            className="w-full flex items-center justify-center gap-2 px-7 py-4 rounded-pill bg-gradient-to-r from-accent to-accent-purple text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === "sending" ? t.contact.sending : status === "sent" ? t.contact.sent : t.contact.send}
            {status === "idle" && <SendIcon />}
          </button>

          {(status === "sent" || status === "error") && (
            <Toast type={status} onDismiss={() => setStatus("idle")} successMsg={t.contact.toastSuccess} errorMsg={t.contact.toastError} />
          )}
        </form>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-[#0A0A0A] mb-4">
            {t.contact.connectHeading}
          </h3>

          {socialLinks.map((link) => {
            const colorClass = PLATFORM_COLORS[link.platform] || "bg-foreground";
            const icon = PLATFORM_ICONS[link.platform];
            const handle = getPlatformHandle(link.url, link.platform);

            return (
              <a
                key={`${link.platform}-${link.url}`}
                href={link.url}
                target={link.platform === "email" ? undefined : "_blank"}
                rel={link.platform === "email" ? undefined : "noopener noreferrer"}
                className="flex items-center gap-4 p-4 rounded-2xl border border-border transition-colors group card-lift"
                aria-label={`${link.platform}: ${handle}`}
              >
                <div className={`w-12 h-12 rounded-full ${colorClass} flex items-center justify-center flex-shrink-0`}>
                  {icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#0A0A0A] capitalize">
                    {link.platform}
                  </p>
                  <p className="text-sm text-muted truncate">
                    {handle}
                  </p>
                </div>
                <ArrowIcon />
              </a>
            );
          })}

          {email && !socialLinks.some((l) => l.platform === "email") && (
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-4 p-4 rounded-2xl border border-border transition-colors card-lift"
              aria-label={`Email: ${email}`}
            >
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                {PLATFORM_ICONS.email}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#0A0A0A]">{t.contact.emailLabel}</p>
                <p className="text-sm text-muted truncate">{email}</p>
              </div>
              <ArrowIcon />
            </a>
          )}

          {availabilityText && (
            <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-[#FCE7F3] to-[#F3E8FF] text-[#364153]">
              <p className="text-sm leading-relaxed">
                <span className="font-bold">{t.contact.availability} </span>
                {availabilityText}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

ContactSection.displayName = "ContactSection";
