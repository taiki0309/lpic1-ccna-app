import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AmplifyProvider from "@/components/AmplifyProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LPIC-1 & CCNA 対策アプリ | ITインフラ学習をスマートに",
  description: "LPIC-1（Linux技術者認定）およびCCNA（ネットワーク技術者認定）の試験対策に特化した学習アプリ。問題演習・シミュレーターでスコアアップを目指そう。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AmplifyProvider>{children}</AmplifyProvider>
      </body>
    </html>
  );
}
