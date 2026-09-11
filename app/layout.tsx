import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { LanguageProvider } from "@/components/providers/language-provider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { CartProvider } from "@/components/shop/cart-context";
import { CookieBanner } from "@/components/cookie-banner";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://rt18-formula1-official-site.vercel.app"
  ),
  other: {
    'google-site-verification': 'G-7V8FYG7SDB',
  },
  title: "Ryusei Tsukamoto — Multi-Discipline Portfolio",
  description:
    "Official Personal Portfolio of Ryusei Tsukamoto. Featuring Developer Projects, Illustrations, Music, Blog Articles, and Investment Research.",
  keywords: [
    "Ryusei Tsukamoto",
    "Developer Portfolio",
    "Software Engineer",
    "Illustrator",
    "Musician",
    "Blogger",
    "Investor",
    "Web Application",
    "Next.js",
  ],
  openGraph: {
    title: "Ryusei Tsukamoto — Multi-Discipline Portfolio",
    description:
      "Official Personal Portfolio of Ryusei Tsukamoto across Developer Projects, Art, Music, Writing, and Investment.",
    url: "/",
    siteName: "Ryusei Tsukamoto Portfolio",
    locale: "ja_JP",
    type: "website",
    images: ["/icon.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ryusei Tsukamoto — Multi-Discipline Portfolio",
    description: "Official Personal Portfolio of Ryusei Tsukamoto.",
    images: ["/icon.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Ryusei Tsukamoto",
  },
  icons: {
    icon: [
      { url: "/icon.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  alternates: {
    canonical: "/",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-white text-black font-sans selection:bg-black selection:text-white">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-7V8FYG7SDB"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-7V8FYG7SDB');
          `}
        </Script>
        <LanguageProvider>
          <CartProvider>
            {children}
            <CookieBanner />
          </CartProvider>
        </LanguageProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
