import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Inter } from "next/font/google";
import { Navigation } from "@/src/adapters/routes/components/Navigation";
import { SkipToContent } from "@/src/adapters/routes/components/SkipToContent";
import { LocaleProvider } from "@/src/i18n";
import type { Locale } from "@/src/i18n";
import { translations } from "@/src/i18n/translations";
import { getSanityDataService } from "@/src/services";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import "@/src/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://gabinajm.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Gabinajm | Product Designer",
    template: "%s | Gabinajm",
  },
  description: "Gabi Abinajm is a Product Designer crafting accessible, human-centered digital experiences. Explore her portfolio of UX/UI design projects built with intentional simplicity and inclusive design principles.",
  keywords: [
    "Product Designer",
    "UX Design",
    "UI Design",
    "Accessibility",
    "Portfolio",
    "User Experience",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Gabinajm",
    title: "Gabinajm | Product Designer",
    description: "Gabi Abinajm is a Product Designer crafting accessible, human-centered digital experiences with intentional simplicity and inclusive design.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Gabinajm — Product Designer Portfolio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gabinajm | Product Designer",
    description: "Gabi Abinajm is a Product Designer crafting accessible, human-centered digital experiences with intentional simplicity and inclusive design.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("locale")?.value;
  const locale: Locale = localeCookie === "pt" ? "pt" : "en";

  let resumeUrl: string | null = null;
  let pastExperience: Array<{ name: string; url: string | null; logo: { url: string; alt: string } }> = [];

  try {
    const dataService = await getSanityDataService();
    const profile = await dataService.getProfile(locale);
    if (profile) {
      resumeUrl = profile.getResumeUrl?.() ?? profile.resumeUrl;
      pastExperience = profile.pastExperience.map((c) => ({
        name: c.name,
        url: c.url,
        logo: { url: c.logo.url, alt: c.logo.alt },
      }));
    }
  } catch {
    // Profile data is optional for navigation
  }

  return (
    <html lang={locale} className={inter.variable} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
      </head>
      <body suppressHydrationWarning className="min-h-screen flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Gabi",
              jobTitle: "Product Designer",
              url: BASE_URL,
              sameAs: [
                "https://linkedin.com/in/gabinajm",
                "https://instagram.com/gabinajm",
              ],
            }),
          }}
        />
        <LocaleProvider initialLocale={locale}>
          <SkipToContent />
          <Navigation brandName="Gabinajm" resumeUrl={resumeUrl} pastExperience={pastExperience} />
          <main id="main-content" className="flex-1">{children}</main>
          <footer className="w-full bg-[#FFFFFF80] border-t-[1px] border-[#FCE7F3]">
          <div className="container-max py-10 flex flex-col items-center gap-1 text-sm text-muted min-h-[88px]">
            <p>
              {translations[locale].footer.copyright.replace("{year}", String(new Date().getFullYear()))}
              {" · "}
              {translations[locale].footer.developedBy}{" "}
              <a href="https://github.com/orrevua/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-accent transition-colors">@orrevua</a>
            </p>
            <p>{translations[locale].footer.tagline}</p>
          </div>
          </footer>
        </LocaleProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}

RootLayout.displayName = "RootLayout";
