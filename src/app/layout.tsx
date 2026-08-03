import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AmplifyProvider from "@/components/AmplifyProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import AuthGuard from "@/components/AuthGuard";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import ZoomPreventer from "@/components/ZoomPreventer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ITインフラ技術者認定学習アプリ - LPIC & CCNA",
  description: "LPIC-1 および CCNA 資格取得をサポートする実践学習アプリ",
  icons: {
    icon: [
      { url: "/characters/boy.png" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/characters/boy.png",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/characters/boy.png" },
    ],
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
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
        <ZoomPreventer />
        <AmplifyProvider>
          <ThemeProvider>
            <AuthGuard>
              <div className="app-shell">
                <Sidebar />
                <div className="main-content flex flex-col min-h-screen">
                  <Header />
                  <div className="flex-1 pb-16 lg:pb-0">{children}</div>
                  <BottomNav />
                </div>
              </div>
            </AuthGuard>
          </ThemeProvider>
        </AmplifyProvider>
      </body>
    </html>
  );
}

