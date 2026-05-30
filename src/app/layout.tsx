import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Inter } from "next/font/google";
import { Navigation } from "@/src/adapters/routes/components/Navigation";
import { TranslatedFooter } from "@/src/adapters/routes/components/TranslatedFooter";
import { SkipToContent } from "@/src/adapters/routes/components/SkipToContent";
import { LocaleProvider } from "@/src/i18n";
import type { Locale } from "@/src/i18n";
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
  description: "Product Designer crafting accessible and human-centered experiences",
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
    description: "Product Designer crafting accessible and human-centered experiences",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gabinajm | Product Designer",
    description: "Product Designer crafting accessible and human-centered experiences",
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

  return (
    <html lang={locale} className={inter.variable} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
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
          <Navigation brandName="Gabinajm" />
          <main id="main-content">{children}</main>
          <TranslatedFooter />
        </LocaleProvider>
      </body>
    </html>
  );
}

RootLayout.displayName = "RootLayout";
