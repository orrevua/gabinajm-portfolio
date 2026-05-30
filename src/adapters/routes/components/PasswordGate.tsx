"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "@/src/i18n";

export interface PasswordGateProps {
  slug: string;
  projectTitle: string;
}

const ShieldIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

export const PasswordGate: React.FC<PasswordGateProps> = ({ slug, projectTitle }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/projects/${slug}/unlock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.refresh();
        return;
      }

      const data = await res.json();
      setError(data.error || t.password.incorrectPassword);
    } catch {
      setError(t.password.genericError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col pt-28 md:pt-36">
      <div className="container-max mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#0A0A0A]/70 hover:text-[#0A0A0A] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
          {t.projects.backToProjects}
        </Link>
      </div>

      <div className="flex-1 flex items-start justify-center px-6">
        <div
          className="w-full max-w-md bg-white rounded-3xl p-8 md:p-10 shadow-sm"
          role="dialog"
          aria-label={`Password required for ${projectTitle}`}
        >
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent-purple flex items-center justify-center mb-5">
              <ShieldIcon />
            </div>
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-accent to-accent-purple bg-clip-text text-transparent mb-2">
              {t.password.title}
            </h1>
            <p className="text-sm text-[#0A0A0A]/60">
              {t.password.subtitle}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <label htmlFor="project-password" className="block text-sm font-semibold text-[#0A0A0A] mb-2">
              {t.password.label}
            </label>
            <div className="relative mb-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0A0A0A]/40">
                <LockIcon />
              </span>
              <input
                id="project-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.password.placeholder}
                className={`form-input pl-10 pr-10 ${error ? "border-accent ring-2 ring-accent/30" : ""}`}
                autoFocus
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#0A0A0A]/40 hover:text-[#0A0A0A]/70 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            {error && (
              <p className="text-sm text-[#0A0A0A] mt-1.5 mb-4" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full mt-4 px-7 py-3.5 rounded-pill bg-gradient-to-r from-accent to-accent-purple text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t.password.verifying : t.password.unlock}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

PasswordGate.displayName = "PasswordGate";
