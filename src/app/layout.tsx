import type { Metadata } from "next";
import "./globals.css";

import { TRPCReactProvider } from "@/trpc/client";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
// Vercel Analytics
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://example.com"),
  title: {
    template: "%s - Jake Kinchen Photography",
    default: "Jake Kinchen Photography",
  },
  description: "Professional photography by Jake Kinchen - portraits, events, real estate, and landscapes",
  openGraph: {
    title: "Jake Kinchen Photography",
    description:
      "Professional photography by Jake Kinchen - portraits, events, real estate, and landscapes",
    type: "website",
    url: "/",
    images: [
      {
        url: "/avatar.jpg",
        width: 1200,
        height: 630,
        alt: "Jake Kinchen Photography",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jake Kinchen Photography",
    description:
      "Professional photography by Jake Kinchen - portraits, events, real estate, and landscapes",
    images: ["/avatar.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <NuqsAdapter>
          <TRPCReactProvider>
            <ThemeProvider attribute="class">
              <Toaster />
              {children}
            </ThemeProvider>
          </TRPCReactProvider>
        </NuqsAdapter>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
