import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sitreps - THE Hub for Veterans in Business",
  description: "Self-service tools to help veterans make informed decisions about their careers, finances, and transitions.",
  keywords: ["veterans", "military transition", "career tools", "salary calculator", "resume builder"],
  authors: [{ name: "Sitreps" }],
  openGraph: {
    title: "Sitreps - THE Hub for Veterans in Business",
    description: "Self-service tools to help veterans make informed decisions about their careers, finances, and transitions.",
    type: "website",
    locale: "en_US",
    siteName: "Sitreps",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sitreps - THE Hub for Veterans in Business",
    description: "Self-service tools to help veterans make informed decisions about their careers, finances, and transitions.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
