import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { getSiteConfig } from "@/lib/api";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export async function generateMetadata(): Promise<Metadata> {
  const site = getSiteConfig();
  return {
    title: {
      default: site.siteName,
      template: `%s | ${site.siteName}`,
    },
    description: site.description,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // In a real app, this ID should come from env vars.
  // For MVP, we can leave a placeholder or env var hook.
  const gaId = process.env.NEXT_PUBLIC_GA_ID || '';

  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased min-h-screen flex flex-col bg-background text-foreground`}>
        <GoogleAnalytics gaId={gaId} />
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
