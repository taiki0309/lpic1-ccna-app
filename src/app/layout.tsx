import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AmplifyProvider from "@/components/AmplifyProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import AuthGuard from "@/components/AuthGuard";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LPIC×CCNA 学習室 | ITインフラ資格対策",
  description: "LPIC-1・CCNAの試験対策アプリ。4択問題・CLIシミュレーター・環境構築ガイドで、初心者から合格まで一本道。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body>
        <AmplifyProvider>
          <ThemeProvider>
            <AuthGuard>
              <div className="app-shell">
                <Sidebar />
                <div className="main-content flex flex-col">
                  <Header />
                  <div className="flex-1">{children}</div>
                </div>
              </div>
            </AuthGuard>
          </ThemeProvider>
        </AmplifyProvider>
      </body>
    </html>
  );
}

