"use client";

import { useActionState, useEffect, useState, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { IconCheck, IconAlertCircle } from "@tabler/icons-react";
import { useTranslation } from "@/src/i18n";

function Toast({ type, message, onDismiss }: { type: "sent" | "error"; message: string; onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const isSent = type === "sent";
  const base = isSent ? "bg-[#D2FCD8]/95 text-[#0A0A0A] border-[#1a7a2e]" : "bg-[#FCE7F3]/95 text-[#0A0A0A] border-[#c4365a]";
  return (
    <div
      className={`flex items-center gap-3 px-6 py-4 rounded-pill text-base font-medium animate-fade-in border cursor-pointer backdrop-blur-sm w-full ${base}`}
      role="alert"
      onClick={onDismiss}
    >
      {isSent ? (
        <IconCheck size={20} className="shrink-0 text-[#1a7a2e]" aria-hidden="true" />
      ) : (
        <IconAlertCircle size={20} className="shrink-0 text-[#c4365a]" aria-hidden="true" />
      )}
      {message}
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
  email: "bg-gradient-to-br from-[#F6339A] via-[#F6339A] to-[#FF2056]",
  linkedin: "bg-[#0077B5]",
  instagram: "bg-gradient-to-br from-[#AD46FF] via-[#F6339A] to-[#F6339A]",
  github: "bg-foreground",
  twitter: "bg-[#1DA1F2]",
};

const PLATFORM_ICONS: Record<string, ReactNode> = {
  email: (
    <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-10 6L2 7" />
    </svg>
  ),
  linkedin: (
    <svg width="25" height="25" viewBox="0 0 24 24" fill="white" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  instagram: (
    <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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

type ContactState =
  | { status: "idle" }
  | { status: "sent" }
  | { status: "error"; message: string };

const INITIAL_STATE: ContactState = { status: "idle" };

function SubmitButton({ disabled, sendingLabel, sentLabel, sendLabel, sentStatus }: { disabled: boolean; sendingLabel: string; sentLabel: string; sendLabel: string; sentStatus: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="w-full flex items-center justify-center gap-2 px-7 py-4 rounded-pill bg-gradient-to-r from-accent to-accent-purple text-white font-bold hover:opacity-90 active:scale-95 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {pending ? sendingLabel : sentStatus ? sentLabel : sendLabel}
      {!pending && !sentStatus && <SendIcon />}
    </button>
  );
}

export function ContactSection({
  heading,
  subtitle,
  email,
  socialLinks = [],
  availabilityText,
}: ContactSectionProps) {
  const { t } = useTranslation();
  const displayHeading = heading || t.contact.heading;
  const displaySubtitle = subtitle || t.contact.subtitle;

  const errors = t.contact.errors as Record<string, string>;
  const errorFallback = t.contact.toastError;

  const [state, formAction] = useActionState(
    async (_prev: ContactState, formData: FormData): Promise<ContactState> => {
      const name = String(formData.get("name") || "");
      const emailValue = String(formData.get("email") || "");
      const message = String(formData.get("message") || "");

      if (name.trim().length < 2) {
        return { status: "error", message: errors["NAME_REQUIRED"] || errorFallback };
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
        return { status: "error", message: errors["EMAIL_INVALID"] || errorFallback };
      }
      if (message.trim().length < 10) {
        return { status: "error", message: errors["MESSAGE_REQUIRED"] || errorFallback };
      }

      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email: emailValue, message }),
        });
        if (res.ok) return { status: "sent" };
        const data = await res.json();
        const code = data.error as string;
        return { status: "error", message: errors[code] || errorFallback };
      } catch {
        return { status: "error", message: errorFallback };
      }
    },
    INITIAL_STATE
  );

  const [prevState, setPrevState] = useState(state);
  const [dismissedFor, setDismissedFor] = useState<ContactState["status"] | null>(null);
  const [sendCount, setSendCount] = useState(0);

  if (prevState !== state) {
    setPrevState(state);
    setDismissedFor(null);
    if (state.status === "sent") {
      setSendCount((c) => c + 1);
    }
  }

  const visibleToast =
    (state.status === "sent" || state.status === "error") && dismissedFor !== state.status
      ? state
      : null;

  const sentLocked = state.status === "sent" && dismissedFor !== "sent";

  return (
    <section className="container-max py-24 md:py-24 scroll-mt-20" aria-label={displayHeading} id="contact">
      <h2 className="text-heading font-extrabold text-[#0A0A0A] mb-2">
        {displayHeading}
      </h2>
      <p className="text-xl text-muted mb-10">
        {displaySubtitle}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
        <div>
          <form key={`form-${sendCount}`} action={formAction} noValidate className="space-y-6">
          <div>
            <label htmlFor="contact-name" className="block text-sm font-medium text-[#0A0A0A] mb-2">
              {t.contact.nameLabel}
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder={t.contact.namePlaceholder}
              aria-invalid={state.status === "error" ? "true" : undefined}
              className="w-full px-4 py-3.5 rounded-[14px] border border-border bg-white text-[#0A0A0A] placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
            />
          </div>

          <div>
            <label htmlFor="contact-email" className="block text-sm font-medium text-[#0A0A0A] mb-2">
              {t.contact.emailLabel}
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder={t.contact.emailPlaceholder}
              aria-invalid={state.status === "error" ? "true" : undefined}
              className="w-full px-4 py-3.5 rounded-[14px] border border-border bg-white text-[#0A0A0A] placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
            />
          </div>

          <div>
            <label htmlFor="contact-message" className="block text-sm font-medium text-[#0A0A0A] mb-2">
              {t.contact.messageLabel}
            </label>
            <textarea
              id="contact-message"
              name="message"
              placeholder={t.contact.messagePlaceholder}
              rows={4}
              aria-invalid={state.status === "error" ? "true" : undefined}
              className="w-full px-4 py-3.5 rounded-[14px] border border-border bg-white text-[#0A0A0A] placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors resize-none"
            />
          </div>

          {visibleToast && (
            <div aria-live="polite">
              <Toast
                type={visibleToast.status}
                message={visibleToast.status === "sent" ? t.contact.toastSuccess : visibleToast.message}
                onDismiss={() => setDismissedFor(visibleToast.status)}
              />
            </div>
          )}

          <SubmitButton
            disabled={sentLocked}
            sendingLabel={t.contact.sending}
            sentLabel={t.contact.sent}
            sendLabel={t.contact.send}
            sentStatus={sentLocked}
          />
          </form>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-[#0A0A0A] mb-4">
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
                aria-label={`${link.platform}: ${handle}${link.platform !== "email" ? " (opens in new tab)" : ""}`}
              >
                <div className={`w-12 h-12 rounded-[14px] ${colorClass} flex items-center justify-center flex-shrink-0`}>
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
              <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-[#F6339A] to-[#FF2056] flex items-center justify-center flex-shrink-0">
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
}
