import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from 'next-auth/react';
import { LocaleProvider } from '@/components/providers/LocaleProvider';
import Navbar from '@/components/layout/Navbar';
import AdminFloatingButton from '@/components/admin/AdminFloatingButton';
import { Analytics } from '@vercel/analytics/react';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HNHED's Blog",
  description: "Full-stack developer & tech enthusiast. Code, Think and Repeat.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <link rel="preconnect" href="https://hnhed-blog.top" />
      <link rel="dns-prefetch" href="https://hnhed-blog.top" />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LocaleProvider>
          <SessionProvider>
            <Navbar />
            {children}
            <AdminFloatingButton />
          </SessionProvider>
        </LocaleProvider>
        <Analytics />
      </body>
    </html>
  );
}
